# 03 – React Architecture

## Guiding principles (SOLID)

| Principle | Application in this migration |
|-----------|-------------------------------|
| **S** – Single Responsibility | Each React component renders exactly one thing; hooks own state logic |
| **O** – Open/Closed | New field types added by registering a renderer, not by modifying existing code |
| **L** – Liskov Substitution | All field renderers accept the same `FieldRendererProps`; they are interchangeable |
| **I** – Interface Segregation | Separate props interfaces: `FormProps`, `TableProps`, `FieldProps` |
| **D** – Dependency Inversion | Components depend on the `FieldRendererRegistry` abstraction, not on concrete renderers |

---

## Multi-package monorepo architecture (Phase A → B)

The migration is structured as a monorepo from day one so that Phase B (multi-platform) is a natural extension, not a rewrite.

```
pinteg/                          ← monorepo root
├── packages/
│   ├── pinteg-core/             ← Platform-AGNOSTIC (no DOM, no React Native)
│   │   └── src/
│   │       ├── schema/          ← ComponentSchema, IComponentDefinition, IComponentSize
│   │       ├── registry/        ← FieldRendererRegistry (abstract, type-safe)
│   │       └── utils/           ← SchemaUtils, ComponentSizeUtils
│   │
│   ├── pinteg-react/            ← React (web + Electron) renderer — Phase A
│   │   └── src/
│   │       ├── themes/
│   │       ├── components/      ← PIntegForm, PIntegTable, PIntegRoot
│   │       ├── fields/          ← TextField, IntegerField, DoubleField, ListField
│   │       └── hooks/
│   │
│   └── pinteg-native/           ← React Native renderer (Android + iOS) — Phase B
│       └── src/
│           ├── components/      ← NativeForm, NativeTable
│           └── fields/          ← NativeTextField, NativeIntegerField …
│
├── apps/
│   ├── demo-web/                ← Vite + React demo
│   └── demo-electron/           ← Electron + pinteg-react demo — Phase B
│
└── docs/
```

### How a platform renderer works

Each platform package depends on `pinteg-core` and implements **one thing**: field components that satisfy the `FieldRendererProps` contract defined in core.

```
JSON Schema  →  pinteg-core (registry + schema parsing)
                        │
          ┌────────────────┼─────────────────┐
          ▼                       ▼
  pinteg-react               pinteg-native
  (Web / Electron)            (Android / iOS)
  │ TextField → <input>       │ NativeTextField → <TextInput>
  │ ListField → <select>      │ NativeListField  → Picker
  └ PIntegForm → <div>        └ NativeForm      → <ScrollView>
```

The consumer's schema and `register()` calls are **identical** on all platforms. Only the import changes.

---

## Phase A – `pinteg-react` folder structure (current focus)

```
src/
├── index.ts                         # Public exports
│
├── schema/
│   ├── ComponentSchema.ts           # Re-exported type (unchanged)
│   ├── IComponentDefinition.ts      # Re-exported interface (unchanged)
│   └── IComponentSize.ts            # Re-exported interface (unchanged)
│
├── themes/
│   ├── themes.ts                    # Theme definitions (CSS variable maps – unchanged)
│   ├── ThemeContext.tsx             # React Context for active theme
│   └── ThemeProvider.tsx            # Provider component; injects CSS variables
│
├── registry/
│   ├── FieldRendererRegistry.ts     # Registry: type string → React component (O, D)
│   └── defaultRenderers.ts          # Registers built-in: text, integer, double, list
│
├── components/
│   ├── PIntegForm.tsx               # Single-record form (replaces ComponentComposite)
│   ├── PIntegTable.tsx              # Multi-record table (replaces ComponentMultipleValue)
│   ├── PIntegRoot.tsx               # Root wrapper: injects ThemeProvider
│   └── fields/
│       ├── TextField.tsx            # type = 'text'
│       ├── IntegerField.tsx         # type = 'integer'
│       ├── DoubleField.tsx          # type = 'double'
│       └── ListField.tsx            # type = 'list'
│
├── hooks/
│   ├── useFormState.ts              # Manages form values Map<name, any>
│   ├── useTableState.ts             # Manages rows array
│   └── useFieldRenderer.ts          # Looks up renderer from registry
│
└── utils/
    ├── ComponentSizeUtils.ts        # size string → CSS calc string
    └── SchemaUtils.ts               # Schema iteration helpers
```

---

## Component hierarchy

```
<PIntegRoot theme="dark-theme">
  <ThemeProvider>           ← injects CSS variables via style attribute

    /* Single-record mode */
    <PIntegForm schema={schema} value={obj} onChange={fn} readOnly={bool} />
      └── <FieldRenderer>   ← for each schema property
            ├── <TextField />
            ├── <IntegerField />
            ├── <DoubleField />
            └── <ListField />

    /* Multi-record mode */
    <PIntegTable schema={schema} value={rows} onChange={fn} readOnly={bool} />
      ├── <thead> … (column captions)
      └── <tbody>
            └── <tr> → <FieldRenderer> per column (inline / table mode)

  </ThemeProvider>
</PIntegRoot>
```

---

## State management strategy

```
┌──────────────────────────────────┐
│  Consumer (parent app)           │
│  value={obj}  onChange={handler} │
└──────────────┬───────────────────┘
               │ props (controlled)
       ┌───────▼────────┐
       │  PIntegForm    │   ← controlled component
       │  useFormState  │   ← optional uncontrolled fallback
       └───────┬────────┘
               │ fieldValue, onChange per field
       ┌───────▼────────┐
       │  FieldRenderer │
       └───────┬────────┘
               │ value, onChange, readOnly, size
       ┌───────▼────────┐
       │  TextField /   │
       │  ListField …   │
       └────────────────┘
```

The library supports **controlled** (consumer owns state) and **uncontrolled** (internal state) modes.

---

## FieldRendererRegistry (Open/Closed principle)

```typescript
// registry/FieldRendererRegistry.ts
export type FieldRendererProps = {
  name: string;
  caption: string;
  value: any;
  size: string;
  readOnly: boolean;
  tableMode: boolean;
  onChange: (name: string, value: any) => void;
  props: Record<string, any>;      // extra definition properties (e.g. options for list)
};

export type FieldRenderer = React.ComponentType<FieldRendererProps>;

export class FieldRendererRegistry {
  private static renderers = new Map<string, FieldRenderer>();

  static register(type: string, renderer: FieldRenderer): void {
    this.renderers.set(type, renderer);
  }

  static get(type: string): FieldRenderer {
    const renderer = this.renderers.get(type);
    if (!renderer) throw new Error(`Unknown field type: "${type}"`);
    return renderer;
  }
}
```

Built-in types are registered in `defaultRenderers.ts` without touching the registry itself. Consumer can add custom types the same way.

---

## Replacing `IScreenReaderWriter`

The current seam between components and the DOM is `IScreenReaderWriter`. In React this seam disappears because all rendering is declarative: each component just returns JSX. The only remaining concern is **controlled value access** (equivalent to `readValue` / `writeValue`), which is handled by `useFormState` / `useTableState` hooks plus a forwarded `ref` exposing `{ readValue, writeValue }` on the root component.

---

## CSS variable injection (replacing StyleFactory + ElementFactory)

Instead of imperatively injecting `<style>` tags:

```tsx
// themes/ThemeProvider.tsx
const ThemeProvider: React.FC<{ theme: ThemeId; children: ReactNode }> = ({ theme, children }) => {
  const selectedTheme = themes.find(t => t.id === theme) ?? themes[0];
  const cssVars = Object.fromEntries(
    Object.entries(selectedTheme.properties).map(([k, v]) => [`--${k}`, v])
  ) as React.CSSProperties;

  return <div className="pinteg-root" style={cssVars}>{children}</div>;
};
```

The CSS variable names remain identical to the current system, so existing custom CSS in consumer apps continues to work.
