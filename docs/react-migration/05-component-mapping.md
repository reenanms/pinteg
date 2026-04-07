# 05 – Component Mapping

This document maps every class in the current TypeScript implementation to its React equivalent.

---

## Class → Component / Hook mapping table

| Current class / interface | Role | React equivalent |
|---------------------------|------|-----------------|
| `PInteg` | Fluent API builder | Removed; replaced by `<PIntegForm>` and `<PIntegTable>` JSX components |
| `ScreenBuilder` | Calls `build()` on components | Removed; React rendering is automatic |
| `ComponentComposite` | Renders a group of fields vertically | `<PIntegForm>` component |
| `ComponentMultipleValue` | Renders a table of rows | `<PIntegTable>` component |
| `BasicComponent` | Base class for leaf fields | `FieldRendererProps` interface (common props) |
| `TextComponent` | Text input | `<TextField>` component |
| `IntegerComponent` | Integer input | `<IntegerField>` component |
| `DoubleComponent` | Float/double input | `<DoubleField>` component |
| `ListComponent` | Select dropdown | `<ListField>` component |
| `ComponentFactory` | Creates components by type string | `FieldRendererRegistry` class |
| `ComponentSizeFactory` | Parses size string → multiplier | `sizeToStyle()` utility function |
| `ComponentLoader` | Iterates schema and creates components | `schemaToFields()` helper + map inside `PIntegForm` |
| `HtmlDocumentReaderWriter` | DOM read/write seam | Removed; JSX replaces imperative DOM writes |
| `ElementFactory` | Creates raw HTML elements | Removed; standard JSX elements |
| `StyleFactory` | Injects `<style>` tags | `ThemeProvider` (CSS variables via `style` prop) |
| `Themes` | Theme CSS variable maps | `themes.ts` (unchanged data, same structure) |
| `IComponent` | `build/writeValue/readValue` contract | `React.forwardRef` + `{ readValue, writeValue }` on ref |
| `IScreenReaderWriter` | DOM abstraction | Removed; React's virtual DOM is the abstraction |
| `BuildConfig` | readonly + mode flags | Props: `readOnly`, plus component choice (`Form` vs `Table`) |

---

## Detailed component specifications

### `<PIntegForm>`

Replaces `ComponentComposite`.

```typescript
interface PIntegFormProps {
  schema: ComponentSchema;          // field definitions
  value?: Record<string, any>;      // controlled value (optional)
  defaultValue?: Record<string, any>; // uncontrolled initial value
  onChange?: (value: Record<string, any>) => void;
  readOnly?: boolean;
  listOptions?: Record<string, Array<{ key: string; caption: string }>>; // dynamic options
  orientation?: 'vertical' | 'horizontal'; // layout direction (default: vertical)
  className?: string;
  style?: React.CSSProperties;
}

// Ref shape (for programmatic access)
export interface PIntegFormRef {
  readValue(): Record<string, any>;
  writeValue(value: Record<string, any>): void;
}
```

### `<PIntegTable>`

Replaces `ComponentMultipleValue`.

```typescript
interface PIntegTableProps {
  schema: ComponentSchema;
  value?: Record<string, any>[];    // controlled list of rows
  defaultValue?: Record<string, any>[];
  onChange?: (rows: Record<string, any>[]) => void;
  readOnly?: boolean;
  listOptions?: Record<string, Array<{ key: string; caption: string }>>;
  className?: string;
  style?: React.CSSProperties;
}

export interface PIntegTableRef {
  readValue(): Record<string, any>[];
  writeValue(rows: Record<string, any>[]): void;
}
```

### `<PIntegRoot>` / `<ThemeProvider>`

Wraps the form or table and injects CSS variables.

```typescript
interface PIntegRootProps {
  theme?: 'light-theme' | 'dark-theme' | 'compact-theme';  // default: 'light-theme'
  children: React.ReactNode;
}
```

---

## Leaf field rendering (Open/Closed)

Each field type is a standalone React component that implements `FieldRendererProps`. This interface is the **Liskov-compatible contract** — all renderers are interchangeable.

```
FieldRendererProps
    ├── TextField        implements FieldRendererProps
    ├── IntegerField     implements FieldRendererProps
    ├── DoubleField      implements FieldRendererProps
    └── ListField        implements FieldRendererProps
         (+ consumer custom fields registered via FieldRendererRegistry.register)
```

### `<TextField>` specification

```typescript
// Renders: <label> + <input type="text">
// CSS: width from size, height from --input-height, border from --color-border
const TextField: React.FC<FieldRendererProps> = ({ name, caption, value, size, readOnly, onChange, tableMode }) => { ... }
```

### `<IntegerField>` specification

Same as `TextField` but `<input type="number" step="1">` with integer validation on change.

### `<DoubleField>` specification

Same as `TextField` but `<input type="number" step="any">`.

### `<ListField>` specification

```typescript
// Renders: <label> + <select> with options
// Options come from props.props.options or from listOptions[name] passed by parent
const ListField: React.FC<FieldRendererProps> = ({ name, caption, value, size, readOnly, onChange, props, tableMode }) => { ... }
```

---

## `useFormState` hook

Manages internal form state when used in uncontrolled mode.

```typescript
function useFormState(schema: ComponentSchema, initial?: Record<string, any>) {
  const [values, setValues] = useState<Record<string, any>>(initial ?? {});

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  return { values, handleChange, setValues };
}
```

## `useTableState` hook

```typescript
function useTableState(initial?: Record<string, any>[]) {
  const [rows, setRows] = useState(initial ?? []);

  const addRow = useCallback((row: Record<string, any>) => {
    setRows(prev => [...prev, row]);
  }, []);

  return { rows, setRows, addRow };
}
```
