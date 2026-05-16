# Refactoring `pinteg-core` Component Registry (Adapter Pattern)

## The Problem

The `pinteg-core` package is intended to be a framework-agnostic foundation for the PInteg ecosystem. However, it currently contains rendering interfaces (`IFieldRenderer`, `FieldRendererProps`) that are tightly coupled to React's function component patterns and types. Because `pinteg-core` allows an open `[key: string]: any` signature on renderers, `pinteg-react` blindly grabs renderers and casts them to `React.FC<any>`. This means `pinteg-core` currently acts as a pseudo-React registry, making it difficult to cleanly support other UI frameworks like Angular, Vue, or Vanilla JS.

### Current Issues Summary

| Problem | Where | Details |
|---|---|---|
| `FieldRendererProps` has React-style callbacks | `pinteg-core/FieldRendererRegistry.ts` | `onChange`, `onBlur` are React event patterns |
| `IFieldRenderer` uses `[key: string]: any` | `pinteg-core/FieldRendererRegistry.ts` | Bypasses all type safety |
| Field components are typed as `React.FC<...> & IFieldRenderer` | `pinteg-react`, `pinteg-formula-field` | Core interface forces React typing |
| `SchemaValidator` reaches into the renderer to read `defaultValidations` | `pinteg-react/SchemaValidator.ts` | Mixes validation metadata with UI rendering |
| Two overlapping renderer contracts exist | `IPIntegRenderer` (Builder) vs `IFieldRenderer` (Registry) | Confusing, unclear which to implement |

## Objectives

1. **Decouple Core from UI Frameworks**: `pinteg-core` must not know what a React or Angular component is.
2. **Abstract Rendering Lifecycle**: Provide a universal interface to mount, update, and unmount components across any framework.
3. **Strong Typing**: Remove `any` types and provide a robust interface for core properties.
4. **Separate Concerns**: Split validation metadata from rendering logic cleanly.
5. **Unify Renderer Contracts**: Clarify the relationship between `IPIntegRenderer` (top-level form/list) and field-level adapters.

## Proposed Architecture: The Universal Adapter Pattern (Option B)

To achieve true framework agnosticism, `pinteg-core` will define a universal `IComponentAdapter`. Instead of registering specific framework components (like `React.FC`), developers will wrap their components in an adapter that knows how to mount/unmount itself in the DOM.

### 1. Core Package (`packages/pinteg-core`)

`pinteg-core` will define standard props and the Adapter interface:

```typescript
import { ValidationResult, IValidationDef } from '@pinteg/validation';

// Core properties passed to all fields — framework agnostic
export interface CoreFieldProps {
    name: string;
    caption?: string;
    value: any;
    size?: string;
    readOnly: boolean;
    tableMode: boolean;
    onChange: (name: string, value: any) => void;
    onBlur?: (name: string) => void;
    formValues?: Record<string, any>;
    props?: any;
    validationResult?: ValidationResult;
}

// The Universal Adapter Interface
export interface IComponentAdapter {
    /** Mount the component into the given DOM container */
    mount(container: HTMLElement, props: CoreFieldProps): void;
    
    /** Update the component with new properties */
    update(props: CoreFieldProps): void;
    
    /** Unmount the component and clean up */
    unmount(): void;
    
    /** Optional validations inherently required by this field type */
    defaultValidations?: IValidationDef[];
}
```

The registry will now solely manage `IComponentAdapter` factory functions:

```typescript
class Registry {
    private map = new Map<string, () => IComponentAdapter>();

    register(type: string, adapterFactory: () => IComponentAdapter): void;
    get(type: string): () => IComponentAdapter;
    has(type: string): boolean;
}
export const FieldAdapterRegistry = new Registry();
```

> **Note**: The registry stores factory functions (`() => IComponentAdapter`) rather than singleton instances. This ensures each field instance gets its own adapter with independent lifecycle state (its own `root`, its own container reference, etc.).

### 2. React Package (`packages/pinteg-react`)

The `pinteg-react` package will provide a utility to seamlessly convert a standard React component into a `IComponentAdapter`.

```typescript
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { IComponentAdapter, CoreFieldProps } from 'pinteg-core';

export function createReactAdapter(Component: React.FC<CoreFieldProps>): () => IComponentAdapter {
    return () => {
        let root: Root | null = null;
        return {
            mount(container: HTMLElement, props: CoreFieldProps) {
                root = createRoot(container);
                root.render(<Component {...props} />);
            },
            update(props: CoreFieldProps) {
                root?.render(<Component {...props} />);
            },
            unmount() {
                root?.unmount();
                root = null;
            }
        };
    };
}
```

### 3. Rendering the Adapter in `PIntegField.tsx`

When `pinteg-react` needs to render a dynamic field, it uses a standard `<div>` container and imperatively calls the adapter.

```tsx
export const PIntegField: React.FC<PIntegFieldProps> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const adapterRef = useRef<IComponentAdapter | null>(null);

    useEffect(() => {
        if (FieldAdapterRegistry.has(type)) {
             adapterRef.current = FieldAdapterRegistry.get(type)(); // Get new instance
             if (containerRef.current) {
                 adapterRef.current.mount(containerRef.current, buildCoreProps(props));
             }
        }
        return () => {
            adapterRef.current?.unmount();
            adapterRef.current = null;
        };
    }, [type]); // Re-mount only if the field type changes

    useEffect(() => {
        // Trigger re-render in the adapter when React state changes
        adapterRef.current?.update(buildCoreProps(props));
    }, [props.value, props.validationResult, props.readOnly, props.formValues]);

    return <div ref={containerRef} className="pinteg-adapter-container" />;
};
```

### 4. Handling `defaultValidations` in `SchemaValidator.ts`

Currently `SchemaValidator.ts` reaches into the `FieldRendererRegistry` to grab `renderer.defaultValidations`. With the adapter pattern, `defaultValidations` lives on the `IComponentAdapter` interface.

The `SchemaValidator` will query the `FieldAdapterRegistry` for the adapter factory, create a temporary instance, and read its `defaultValidations`:

```typescript
import { FieldAdapterRegistry } from 'pinteg-core';

export function getComponentValidations(definition: ComponentSchema[string]): IValidationDef[] {
    const activeValidations = (definition.validations || []).map(v =>
        typeof v === 'string' ? { name: v } : v
    );
    
    if (FieldAdapterRegistry.has(definition.type)) {
        const adapterFactory = FieldAdapterRegistry.get(definition.type);
        const adapter = adapterFactory();
        if (adapter.defaultValidations) {
            for (const defVal of adapter.defaultValidations) {
                if (!activeValidations.some(v => v.name === defVal.name)) {
                    activeValidations.push(defVal);
                }
            }
        }
    }
    
    return activeValidations;
}
```

> **Resolved**: `defaultValidations` stays on the adapter instance. The minor cost of creating a throwaway adapter instance during validation lookup is acceptable. See "Resolved Questions" section.

### 5. Relationship with `IPIntegRenderer` (Builder Pattern)

`pinteg-core` already has a separate rendering abstraction: `IPIntegRenderer` in `PIntegBuilder.ts`. This is a **top-level** renderer responsible for rendering entire forms and lists into a DOM element. `ReactRenderer` in `pinteg-react` implements this interface.

These two abstractions serve different levels:

| Abstraction | Level | Purpose |
|---|---|---|
| `IPIntegRenderer` | Top-level (form/list) | Mounts an entire PInteg form or table into a `<div>` |
| `IComponentAdapter` | Field-level | Mounts a single field renderer into a `<div>` |

Both abstractions should remain separate. `IPIntegRenderer` stays as-is (it's already framework-agnostic). `IComponentAdapter` replaces `IFieldRenderer` at the field level.

## Affected Files — Full Inventory

### `packages/pinteg-core`

| File | Action | Details |
|---|---|---|
| `src/registry/FieldRendererRegistry.ts` | **REPLACE** | Remove `FieldRendererProps`, `IFieldRenderer`, `RendererType`. Replace with `CoreFieldProps`, `IComponentAdapter`, and `FieldAdapterRegistry`. |
| `src/index.ts` | **MODIFY** | Update exports to reflect new registry name and interfaces. |
| `src/builder/PIntegBuilder.ts` | **NO CHANGE** | `IPIntegRenderer` is a separate top-level abstraction. Stays as-is. |
| `src/schema/*` | **NO CHANGE** | Schema definitions are already framework-agnostic. |
| `src/validations/*` | **NO CHANGE** | Validation logic is already framework-agnostic. |

### `packages/pinteg-react`

| File | Action | Details |
|---|---|---|
| `src/components/fields/TextField.tsx` | **MODIFY** | Remove `FieldRendererProps`/`IFieldRenderer` imports from core. Type as `React.FC<CoreFieldProps>`. |
| `src/components/fields/IntegerField.tsx` | **MODIFY** | Same as TextField. Move `defaultValidations` assignment into the adapter factory. |
| `src/components/fields/DoubleField.tsx` | **MODIFY** | Same as TextField. Move `defaultValidations` assignment into the adapter factory. |
| `src/components/fields/ListField.tsx` | **MODIFY** | Same as TextField. |
| `src/components/PIntegField.tsx` | **MODIFY** | Replace `FieldRendererRegistry.get(type)` with adapter-based mount/update/unmount via `useRef` + `useEffect`. |
| `src/components/PIntegForm.tsx` | **MODIFY** | Remove unused `FieldRendererRegistry` import. |
| `src/registry/defaultRenderers.ts` | **MODIFY** | Use `createReactAdapter(Component)` and register with `FieldAdapterRegistry`. |
| `src/utils/SchemaValidator.ts` | **MODIFY** | Replace `FieldRendererRegistry` with `FieldAdapterRegistry` for `defaultValidations` lookup. |
| `src/builder/ReactRenderer.tsx` | **NO CHANGE** | Uses `IPIntegRenderer`, not `IFieldRenderer`. Unaffected. |
| **NEW** `src/adapters/createReactAdapter.ts` | **CREATE** | Factory utility to wrap `React.FC<CoreFieldProps>` into `IComponentAdapter`. |

### `packages/pinteg-formula-field`

| File | Action | Details |
|---|---|---|
| `src/FormulaField.tsx` | **MODIFY** | Remove `FieldRendererProps`/`IFieldRenderer` imports. Type as `React.FC<CoreFieldProps>`. |
| `src/index.ts` | **MODIFY** | Use `createReactAdapter` + `FieldAdapterRegistry.register(...)`. Will depend on `pinteg-react` for the adapter utility, OR we provide a vanilla adapter wrapper here. |

### Tests

| File | Action | Details |
|---|---|---|
| `pinteg-react/src/registry/FieldRendererRegistry.test.tsx` | **MODIFY** | Rename/rewrite to test `FieldAdapterRegistry`. |
| `pinteg-react/tst/defaultRenderers.test.ts` | **MODIFY** | Update to test `FieldAdapterRegistry` registration. |
| `pinteg-react/tst/PIntegField.test.tsx` | **MODIFY** | Remove `FieldRendererRegistry` import (already unused). |

## Usage Flow

### For a React Developer
1. Create a native React component `MyCustomField: React.FC<CoreFieldProps>`.
2. Wrap it: `const adapterFactory = createReactAdapter(MyCustomField);`
3. Register it: `FieldAdapterRegistry.register('custom', adapterFactory);`
4. At runtime, `PIntegField` queries the registry, gets an adapter instance, provides a DOM container, and the adapter internally spins up a React root.

### For a Vanilla JS/HTML Developer
1. Implement `IComponentAdapter` directly:
```typescript
const vanillaTextAdapter = (): IComponentAdapter => ({
    mount(container, props) {
        container.innerHTML = `<input type="text" value="${props.value || ''}" />`;
        container.querySelector('input')!.addEventListener('change', (e) => {
            props.onChange(props.name, (e.target as HTMLInputElement).value);
        });
    },
    update(props) { /* update DOM manually */ },
    unmount() { /* cleanup listeners */ }
});

FieldAdapterRegistry.register('text', vanillaTextAdapter);
```

### For an Angular Developer (future)
1. Create a `pinteg-angular` package.
2. Provide a `createAngularAdapter(AngularComponent)` utility that uses Angular's `createComponent()` API.
3. Register: `FieldAdapterRegistry.register('custom', createAngularAdapter(MyAngularField));`

## Resolved Questions

1. ~~**`defaultValidations` location**~~: **Decision** — Remain on the adapter instance as currently proposed. The factory creates instances, and `defaultValidations` stays as a property of `IComponentAdapter`. The small cost of creating a throwaway instance during validation lookup is acceptable.

2. ~~**`pinteg-formula-field` dependency**~~: **Decision** — `pinteg-formula-field` will take a **peer dependency** on `pinteg-react`. Since `FormulaField` is a React component, it naturally depends on `pinteg-react` for the `createReactAdapter` utility. Keeping `createReactAdapter` out of core preserves core's framework-agnostic nature.

3. ~~**CSS compatibility**~~: **Decision** — Yes, verify CSS compatibility. The adapter container `<div class="pinteg-adapter-container">` must be audited to ensure it doesn't break flex sizing or table-mode layouts. This will be checked during implementation.

4. ~~**Container wrapping in `mount()` for multi-platform support**~~: **Decision** — **Option A**: Render directly into the `HTMLElement`. The adapter already owns its subtree via `createRoot(container)`. If native platform support (Android/iOS) is needed later, a separate `INativeAdapter` interface will be created rather than trying to genericize the mount target. Web and native rendering models are fundamentally different enough that a unified `mount()` signature would be a forced abstraction.

## Migration Steps

1. Define `CoreFieldProps` and `IComponentAdapter` in `pinteg-core`.
2. Refactor `FieldRendererRegistry` into `FieldAdapterRegistry` to expect `() => IComponentAdapter`.
3. In `pinteg-react`, create the `createReactAdapter` utility using React 18's `createRoot`.
4. Wrap all default components (`TextField`, `IntegerField`, `DoubleField`, `ListField`) with `createReactAdapter` before registering them. Move `defaultValidations` into the adapter.
5. Update `PIntegField.tsx` to use `useRef` and imperatively mount/update the adapter inside a standard DOM element.
6. Update `SchemaValidator.ts` to query `FieldAdapterRegistry` for `defaultValidations`.
7. Update `pinteg-formula-field` to use `createReactAdapter` and `FieldAdapterRegistry`.
8. Update all affected test files.
9. Rebuild `pinteg-core` first, then `pinteg-react`, then `pinteg-formula-field`.
