# 08 – Implementation Plan

## Overview

The migration is divided into **six phases**. Phases 1–4 deliver the React rewrite (Phase A). Phase 5 delivers multi-platform (Phase B). Phase 6 delivers the plugin ecosystem (Phase C).

Each phase produces working, testable, independently releasable output.

---

## Phase 1 – Project scaffold

**Goal:** Set up the new React project structure with tooling.

### Steps

1. **Initialize the new project**
   ```bash
   npm create vite@latest pinteg-react -- --template react-ts
   # or add React to the existing repo via a new branch
   ```

2. **Install dependencies**
   ```bash
   npm install react react-dom
   npm install -D @types/react @types/react-dom vite @vitejs/plugin-react
   npm install -D @testing-library/react @testing-library/jest-dom vitest jsdom
   ```

3. **Configure `vite.config.ts`** in library mode:
   ```typescript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   export default defineConfig({
     plugins: [react()],
     build: {
       lib: { entry: 'src/index.ts', name: 'pinteg', formats: ['es', 'cjs'] },
       rollupOptions: { external: ['react', 'react-dom'] },
     },
   });
   ```

4. **Create folder structure** as defined in [03-react-architecture.md](./03-react-architecture.md).

5. **Copy preserved files** (no changes needed):
   - `src/implementations/Themes.ts` → `src/themes/themes.ts`
   - `src/contract/IComponentDefinition.ts` → `src/schema/IComponentDefinition.ts`
   - `src/component/ComponentSchema.ts` → `src/schema/ComponentSchema.ts`
   - `src/contract/IComponentSize.ts` → `src/schema/IComponentSize.ts`

**Acceptance criteria:** Project builds with `vite build` without errors; types are emitted.

---

## Phase 2 – Theme system

**Goal:** `ThemeProvider` converts theme objects to scoped CSS variables.

### Steps

1. Create `src/themes/ThemeContext.tsx`.
2. Create `src/themes/ThemeProvider.tsx` — applies CSS variables inline on wrapper `<div>`.
3. Create `src/components/PIntegRoot.tsx` — thin wrapper rendering `<ThemeProvider>`.
4. Create `pinteg.css` with all static class rules (`.pinteg-root`, `.pinteg-input`, `.pinteg-label`, `.pinteg-table`, etc.).

### Tests
```typescript
// ThemeProvider.test.tsx
test('applies light-theme CSS variables', () => {
  const { container } = render(<ThemeProvider theme="light-theme"><div /></ThemeProvider>);
  expect(container.firstChild).toHaveStyle('--color-background: #ffffff');
});
test('falls back to light-theme when theme is unknown', () => { ... });
test('applies dark-theme CSS variables', () => { ... });
```

**Acceptance criteria:** All three themes inject correct CSS variables.

---

## Phase 3 – Field registry and leaf components

**Goal:** All four built-in field types render correctly in isolation.

### Steps

1. Create `src/registry/FieldRendererRegistry.ts` — Map-based registry with `register` / `get`.
2. Create leaf components in `src/components/fields/`:
   - `TextField.tsx`
   - `IntegerField.tsx`
   - `DoubleField.tsx`
   - `ListField.tsx`
3. Create `src/registry/defaultRenderers.ts` — calls `FieldRendererRegistry.register(...)` for the four built-ins.
4. Create `src/utils/ComponentSizeUtils.ts`.

### Field component implementation pattern

```tsx
// TextField.tsx (template for all leaf components)
export const TextField: React.FC<FieldRendererProps> = ({
  name, caption, value, size, readOnly, tableMode, onChange,
}) => {
  const style = sizeToStyle(size);
  return (
    <div className="pinteg-field" style={style}>
      {!tableMode && caption && <label className="pinteg-label" htmlFor={name}>{caption}</label>}
      <input
        id={name}
        name={name}
        type="text"
        className={tableMode ? 'pinteg-table-input' : 'pinteg-input'}
        value={value ?? ''}
        readOnly={readOnly}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  );
};
```

### Tests

```typescript
test('TextField renders label and input', () => { ... });
test('TextField calls onChange with new value', () => { ... });
test('TextField is readonly when readOnly=true', () => { ... });
test('IntegerField restricts input to integers', () => { ... });
test('ListField renders all options', () => { ... });
test('FieldRendererRegistry throws for unknown type', () => { ... });
```

**Acceptance criteria:** Each field renders, accepts input, and fires onChange.

---

## Phase 4 – Composite components and hooks

**Goal:** `<PIntegForm>` and `<PIntegTable>` fully functional.

### Steps

1. Create `src/hooks/useFormState.ts`.
2. Create `src/hooks/useTableState.ts`.
3. Create `src/components/PIntegForm.tsx` with `forwardRef`.
4. Create `src/components/PIntegTable.tsx` with `forwardRef`.
5. Update `src/index.ts` to export everything.
6. Update `package.json` — add `peerDependencies: { react, react-dom }`, set `main`, `module`, `types`.

### `PIntegForm` implementation sketch

```tsx
export const PIntegForm = React.forwardRef<PIntegFormRef, PIntegFormProps>((props, ref) => {
  const { schema, value, defaultValue, onChange, readOnly, listOptions, orientation } = props;
  const isControlled = value !== undefined;
  const [internalValues, setInternalValues] = useFormState(schema, defaultValue);
  const values = isControlled ? value : internalValues;

  const handleChange = useCallback((name: string, fieldValue: any) => {
    if (!isControlled) setInternalValues(prev => ({ ...prev, [name]: fieldValue }));
    onChange?.({ ...values, [name]: fieldValue });
  }, [values, onChange, isControlled]);

  useImperativeHandle(ref, () => ({
    readValue: () => values,
    writeValue: (v) => { if (!isControlled) setInternalValues(v); },
  }));

  return (
    <div className={`pinteg-form pinteg-area-${orientation ?? 'vertical'}`} style={props.style}>
      {Object.entries(schema).map(([name, definition]) => {
        defaultRenderers(); // ensure registered
        const Renderer = FieldRendererRegistry.get(definition.type);
        return (
          <Renderer
            key={name}
            name={name}
            caption={definition.caption ?? ''}
            value={values[name]}
            size={definition.size ?? 'full'}
            readOnly={readOnly ?? false}
            tableMode={false}
            onChange={handleChange}
            props={{ ...definition, options: listOptions?.[name] }}
          />
        );
      })}
    </div>
  );
});
```

### Tests

```typescript
test('PIntegForm renders all schema fields', () => { ... });
test('PIntegForm calls onChange when a field changes', () => { ... });
test('PIntegForm ref.readValue returns current values', () => { ... });
test('PIntegForm ref.writeValue updates displayed values', () => { ... });
test('PIntegForm respects readOnly prop', () => { ... });
test('PIntegTable renders a row per value entry', () => { ... });
test('PIntegTable renders column headers from schema captions', () => { ... });
```

**Acceptance criteria:** Full form/table render, controlled and uncontrolled modes work, ref methods work.

---

## Phase 5 – Monorepo split and multi-platform (Phase B)

**Goal:** Extract the core into a platform-agnostic package; add Electron desktop support; add React Native mobile support.

> ⚠️ This phase starts **after** Phase 4 is complete and the React library is stable.

### Steps

1. **Initialize monorepo** (pnpm workspaces or Turborepo)
   ```bash
   mkdir -p packages/pinteg-core packages/pinteg-react packages/pinteg-native
   npx turbo init   # or pnpm init with workspaces config
   ```

2. **Move platform-agnostic code to `pinteg-core`**
   - `src/schema/` → `packages/pinteg-core/src/schema/`
   - `src/registry/FieldRendererRegistry.ts` → `packages/pinteg-core/src/registry/`
   - `src/utils/` → `packages/pinteg-core/src/utils/`
   - Remove all React/DOM imports from this package

3. **Update `pinteg-react`** to import from `pinteg-core`
   ```typescript
   import { FieldRendererRegistry } from 'pinteg-core';
   ```

4. **Create `apps/demo-electron`**
   ```bash
   npm create vite@latest apps/demo-electron -- --template react-ts
   npm install electron electron-builder -D
   ```
   - Electron main process: opens a `BrowserWindow` that loads the Vite dev server
   - Renderer process: normal React app using `pinteg-react`
   - **No code changes to schemas or field components**

5. **Create `packages/pinteg-native`**
   ```bash
   cd packages/pinteg-native
   npx react-native init PintegNative --template react-native-template-typescript
   ```
   - Implement `NativeTextField`, `NativeIntegerField`, `NativeDoubleField`, `NativeListField` using `<TextInput>`, `<Picker>`
   - Each satisfies the same `FieldRendererProps` contract from `pinteg-core`
   - `NativeForm` and `NativeTable` replace `PIntegForm` and `PIntegTable`

### Acceptance criteria

- [ ] `pinteg-core` builds with zero DOM or React imports
- [ ] `pinteg-react` builds by importing only from `pinteg-core` and `react`
- [ ] Electron demo runs with forms generated from a schema
- [ ] React Native `pinteg-native` renders a form with all four built-in field types on Android emulator

---

## Phase 6 – Plugin / npm ecosystem (Phase C)

**Goal:** Enable the community to publish and consume custom field types as npm packages.

### How the plugin system works

See [09-plugin-ecosystem.md](./09-plugin-ecosystem.md) for full specification.

### Steps

1. **Finalize `FieldRendererProps` and `FieldRendererRegistry` as stable public API** in `pinteg-core`
   - Guarantee semantic versioning: breaking changes to this contract = major version bump
   - Export a dedicated `createFieldPlugin(type, component)` helper to formalize plugin authorship

2. **Create the official plugin template**
   ```bash
   npx degit pinteg/plugin-template pinteg-field-mytype
   ```
   The template includes:
   - `src/index.ts` that exports the component and a `register()` function
   - `package.json` with `peerDependencies: { pinteg-core, react }` (or `react-native` for native plugins)
   - README with usage instructions
   - Jest + React Testing Library test setup

3. **Publish the first official community plugin: `pinteg-field-date`**
   - Validates the plugin contract end-to-end
   - Serves as the reference example in documentation

4. **Create documentation site** with plugin directory

### Acceptance criteria

- [ ] `pinteg-field-date` publishes to npm and installs cleanly
- [ ] Schema `{ birthDate: { type: 'date', caption: 'Birth Date', size: 'medium' } }` works after one `register()` call
- [ ] Plugin template generates a working plugin with no manual edits needed
- [ ] Breaking changes to `FieldRendererProps` trigger a major semver bump (enforced by CI)

---

## Full migration checklist

### Phase 1 – Scaffold
- [ ] Project builds with `vite build` without errors; types are emitted

### Phase 2 – Themes
- [ ] ThemeProvider + pinteg.css
- [ ] Tests passing for all three themes

### Phase 3 – Field registry
- [ ] FieldRendererRegistry implemented
- [ ] TextField, IntegerField, DoubleField, ListField implemented
- [ ] defaultRenderers.ts registers all four types
- [ ] Leaf component tests passing

### Phase 4 – Composite components
- [ ] useFormState and useTableState hooks
- [ ] PIntegForm with forwardRef
- [ ] PIntegTable with forwardRef
- [ ] All composite component tests passing
- [ ] index.ts exports verified
- [ ] Package builds and publishes successfully
- [ ] (Optional) PIntegCompat backward-compat shim

### Phase 5 – Multi-platform
- [ ] pinteg-core extracted, zero DOM/React imports
- [ ] pinteg-react updated to import from pinteg-core
- [ ] Electron demo working
- [ ] pinteg-native: NativeForm + all 4 native field types
- [ ] React Native demo working on Android emulator

### Phase 6 – Plugin ecosystem
- [ ] FieldRendererProps declared stable public API in pinteg-core
- [ ] createFieldPlugin() helper exported
- [ ] Plugin template repository created
- [ ] pinteg-field-date published to npm
- [ ] Plugin documentation published

---

## Tech stack

| Concern | Phase A (React) | Phase B (Multi-platform) | Phase C (Plugins) |
|---------|-----------------|------------------------|-----------------|
| UI framework | React 18+ | React + Electron + React Native | Same |
| Language | TypeScript 5.x | TypeScript 5.x | TypeScript 5.x |
| Bundler | Vite (library mode) | Vite + electron-builder + Metro | Vite |
| Testing | Vitest + RTL | Vitest + Detox (RN) | Vitest + RTL |
| Package manager | pnpm | pnpm workspaces | pnpm |
| Monorepo | None (single pkg) | Turborepo | Turborepo |
| CSS | Vanilla CSS | N/A (RN uses StyleSheet) | Vanilla CSS |
| State | React hooks only | React hooks only | React hooks only |
