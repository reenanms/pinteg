# 07 – Public API Design

## Goals

- Consumer-facing API is completely declarative (JSX).
- Existing `writeObject` / `readObject` patterns are still possible via `ref`.
- Package exports are clean and tree-shakeable.

---

## Package exports (`src/index.ts`)

```typescript
// Types / interfaces
export type { ComponentSchema }        from './schema/ComponentSchema';
export type { IComponentDefinition }   from './schema/IComponentDefinition';
export type { IComponentSize }         from './schema/IComponentSize';
export type { ThemeId }                from './themes/ThemeProvider';
export type { FieldRendererProps }     from './registry/FieldRendererRegistry';
export type { PIntegFormRef }          from './components/PIntegForm';
export type { PIntegTableRef }         from './components/PIntegTable';

// Components
export { PIntegRoot }                  from './components/PIntegRoot';
export { PIntegForm }                  from './components/PIntegForm';
export { PIntegTable }                 from './components/PIntegTable';
export { ThemeProvider }               from './themes/ThemeProvider';

// Registry (for custom field types)
export { FieldRendererRegistry }       from './registry/FieldRendererRegistry';

// Hooks
export { useFormState }                from './hooks/useFormState';
export { useTableState }               from './hooks/useTableState';

// Theme data
export { themes }                      from './themes/themes';
```

---

## `<PIntegRoot>`

Top-level wrapper. Must wrap `<PIntegForm>` or `<PIntegTable>`. Applies theme and root styling.

```tsx
<PIntegRoot theme="dark-theme">
  {/* children */}
</PIntegRoot>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `ThemeId` | `'light-theme'` | Theme selector |
| `children` | `ReactNode` | – | Required |
| `className` | `string` | – | Additional CSS class |
| `style` | `CSSProperties` | – | Additional inline styles |

---

## `<PIntegForm>`

Renders a single-record form. Controlled or uncontrolled.

```tsx
// Controlled
<PIntegForm
  schema={productSchema}
  value={formValue}
  onChange={(v) => setFormValue(v)}
  readOnly={false}
/>

// Uncontrolled + ref
const ref = useRef<PIntegFormRef>(null);
<PIntegForm ref={ref} schema={productSchema} defaultValue={initial} />
// later:
const data = ref.current?.readValue();
ref.current?.writeValue({ name: 'New Product', quantity: 1 });
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | `ComponentSchema` | **required** | Field definitions |
| `value` | `Record<string, any>` | – | Controlled value |
| `defaultValue` | `Record<string, any>` | `{}` | Uncontrolled initial value |
| `onChange` | `(value) => void` | – | Called on any field change |
| `readOnly` | `boolean` | `false` | Disables all inputs |
| `listOptions` | `Record<string, Option[]>` | – | Dynamic options for `list` fields |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |
| `className` | `string` | – | Root div className |
| `style` | `CSSProperties` | – | Root div style |

**Ref interface:**
```typescript
interface PIntegFormRef {
  readValue(): Record<string, any>;
  writeValue(value: Record<string, any>): void;
}
```

---

## `<PIntegTable>`

Renders a multi-record table.

```tsx
// Controlled
<PIntegTable
  schema={productSchema}
  value={rows}
  onChange={(rows) => setRows(rows)}
  readOnly={false}
/>

// Uncontrolled + ref
const ref = useRef<PIntegTableRef>(null);
<PIntegTable ref={ref} schema={productSchema} defaultValue={[]} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | `ComponentSchema` | **required** | Column definitions |
| `value` | `Record<string, any>[]` | – | Controlled rows |
| `defaultValue` | `Record<string, any>[]` | `[]` | Uncontrolled initial rows |
| `onChange` | `(rows) => void` | – | Called when any cell changes |
| `readOnly` | `boolean` | `false` | Disables all inputs |
| `listOptions` | `Record<string, Option[]>` | – | Dynamic dropdown options |
| `className` | `string` | – | Table's wrapper div className |
| `style` | `CSSProperties` | – | Table's wrapper div style |

**Ref interface:**
```typescript
interface PIntegTableRef {
  readValue(): Record<string, any>[];
  writeValue(rows: Record<string, any>[]): void;
}
```

---

## `FieldRendererRegistry` – custom field types

Adding a new field type follows the Open/Closed principle: existing code is untouched.

```typescript
import { FieldRendererRegistry, FieldRendererProps } from 'pinteg';

const DateField: React.FC<FieldRendererProps> = ({ name, caption, value, onChange, readOnly, size }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {caption && <label className="pinteg-label">{caption}</label>}
    <input
      type="date"
      className="pinteg-input"
      name={name}
      value={value ?? ''}
      disabled={readOnly}
      onChange={(e) => onChange(name, e.target.value)}
    />
  </div>
);

// Register once, before first render
FieldRendererRegistry.register('date', DateField);
```

Then use in schema:
```typescript
const schema: ComponentSchema = {
  birthDate: { type: 'date', caption: 'Birth Date', size: 'medium' },
};
```

---

## Backward compatibility shim (optional)

For teams that used the old imperative `PInteg` class, a thin shim can be provided:

```typescript
// compat/PIntegCompat.ts
import ReactDOM from 'react-dom/client';
import { PIntegRoot, PIntegForm, PIntegTable } from '../index';

export class PInteg {
  private root: any;
  private currentRef: any;

  setDivId(id: string): this { /* store id */ return this; }
  setMainSchema(schema: any): this { /* store schema */ return this; }
  setReadOnly(): this { /* store flag */ return this; }
  setViewMultiple(): this { /* store flag */ return this; }

  buildForm(): this {
    const reactRoot = ReactDOM.createRoot(document.getElementById(this.divId)!);
    reactRoot.render(
      <PIntegRoot><PIntegForm ref={this.currentRef} schema={this.schema} readOnly={this.readOnly} /></PIntegRoot>
    );
    return this;
  }

  buildList(): this { /* similar */ return this; }
  writeObject(value: any): this { this.currentRef?.current?.writeValue(value); return this; }
  readObject(): any { return this.currentRef?.current?.readValue(); }
}
```

> **Note:** This shim is optional and for migration convenience only. New code should use the React components directly.

---

## Usage examples

### Basic form

```tsx
import { PIntegRoot, PIntegForm } from 'pinteg';
import 'pinteg/pinteg.css';

const schema = {
  firstName: { type: 'text',    caption: 'First Name', size: 'medium' },
  lastName:  { type: 'text',    caption: 'Last Name',  size: 'medium' },
  age:       { type: 'integer', caption: 'Age',        size: 'small'  },
};

function App() {
  const [value, setValue] = useState({});
  return (
    <PIntegRoot theme="light-theme">
      <PIntegForm schema={schema} value={value} onChange={setValue} />
    </PIntegRoot>
  );
}
```

### Table with dynamic options

```tsx
<PIntegRoot theme="dark-theme">
  <PIntegTable
    schema={schema}
    value={rows}
    onChange={setRows}
    listOptions={{ category: [{ key: 'A', caption: 'Alpha' }, { key: 'B', caption: 'Beta' }] }}
  />
</PIntegRoot>
```
