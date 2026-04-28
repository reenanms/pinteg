# 04 – Schema and Contracts

## JSON Schema format (preserved)

The `ComponentSchema` format is **unchanged** in the React version. All existing consumer schemas work without modification.

### Type definitions

```typescript
// Unchanged from current src/contract/IComponentDefinition.ts
export interface IBasicComponentDefinition {
  caption?: string;   // Label text shown next to the field
  size?: string;      // Width multiplier: 'small' | 'medium' | 'large' | 'full' | custom
  parent?: string;    // (reserved for composite nesting)
}

export interface IComponentDefinition extends IBasicComponentDefinition {
  type: string;       // 'text' | 'integer' | 'double' | 'list' | <custom>
}

// Unchanged from current src/component/ComponentSchema.ts
export type ComponentSchemaProperty = [string, IComponentDefinition];
export type ComponentSchema = Record<string, IComponentDefinition>;
```

### Example schema

```typescript
const productSchema: ComponentSchema = {
  name:     { type: 'text',    caption: 'Product Name', size: 'L'  },
  quantity: { type: 'integer', caption: 'Qty',          size: 'S'  },
  price:    { type: 'double',  caption: 'Unit Price',   size: 'M' },
  category: { type: 'list',    caption: 'Category',     size: 'M' },
};
```

---

## Size system (preserved)

The `IComponentSize` contract drives the CSS width calculation. The React version keeps the same mapping.

```typescript
// contract/IComponentSize.ts  (unchanged)
export interface IComponentSize {
  name: string;
  width: number;  // multiplier applied to --input-width CSS variable
}
```

### Size string → width multiplier mapping

| Size string | Width multiplier | Resulting CSS |
|-------------|-----------------|----------------|
| `S`     | 0.25 | `calc(var(--input-width) * 0.25)` |
| `M`    | 0.5  | `calc(var(--input-width) * 0.5)` |
| `L`     | 0.75 | `calc(var(--input-width) * 0.75)` |
| `XL`      | 1.0  | `calc(var(--input-width) * 1.0)` |
| (default)   | 1.0  | falls back to full |

In React this is computed by a utility function:

```typescript
// utils/ComponentSizeUtils.ts
export function sizeToStyle(size: string): React.CSSProperties {
  const widthMap: Record<string, number> = {
    S: 0.25, M: 0.5, L: 0.75, XL: 1.0,
  };
  const multiplier = widthMap[size] ?? 1.0;
  return { width: `calc(var(--input-width) * ${multiplier})` };
}
```

---

## List (dropdown) field — options contract

`ListComponent` in the current code calls `setOptionsByName`. In React the options are passed directly as a prop. The schema definition for a list field can carry an `options` array:

```typescript
// Extended IComponentDefinition for list fields
export interface IListComponentDefinition extends IComponentDefinition {
  type: 'list';
  options?: Array<{ key: string; caption: string }>;
  defaultSelectedKey?: string;
}
```

> **Note:** If `options` are populated dynamically by the consumer (as in the current `setOptionsByName`), the consumer passes them via `listOptions` prop on `<PIntegForm>` / `<PIntegTable>`.

---

## Value contracts

### Single-record (form)

```typescript
// Read / write value shape mirrors the current readValue() / writeValue()
type FormValue = Record<string, any>;   // { name: 'foo', quantity: 3, price: 9.99, category: 'A' }
```

### Multi-record (table)

```typescript
type TableValue = FormValue[];   // Array of form values, one per row
```

---

## BuildConfig equivalent (props)

| Current `BuildConfig` field | React prop equivalent |
|-----------------------------|-----------------------|
| `readonly: boolean` | `readOnly?: boolean` |
| `mode: ViewMode.Single` | Use `<PIntegForm>` component |
| `mode: ViewMode.Multiple` | Use `<PIntegTable>` component |

---

## Retained contracts (as TypeScript types / interfaces)

These contracts move from `src/contract/` to `src/schema/` and are still exported from the package. No consumer needs to change their import path because the package re-exports them from the root `index.ts`.

```typescript
// src/index.ts (new)
export type { ComponentSchema } from './schema/ComponentSchema';
export type { IComponentDefinition } from './schema/IComponentDefinition';
export type { IComponentSize } from './schema/IComponentSize';
```

---

## IComponent interface – fate in React

`IComponent` (`build`, `writeValue`, `readValue`) is an imperative interface tied to the DOM rendering approach. In React it is **replaced** by:

- `build()` → JSX returned by the React component (automatic)
- `writeValue()` → `value` prop on `<PIntegForm>` or `writeValue()` on forwarded `ref`
- `readValue()` → `onChange` callback or `readValue()` on forwarded `ref`

The interface itself is deprecated but can remain exported for backward compatibility during a transition period.
