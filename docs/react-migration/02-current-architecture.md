# 02 – Current Architecture

## Folder map

```
src/
├── index.ts                   # Public API: PInteg class (fluent builder)
├── builder/
│   └── ScreenBuilder.ts       # Orchestrates build() calls on components
├── component/
│   ├── ComponentSchema.ts     # Type aliases: ComponentSchema, ComponentSchemaProperty
│   ├── BasicComponent.ts      # Base class for leaf components (text, int, double, list)
│   ├── ComponentComposite.ts  # Composite – renders a group of fields (single-record)
│   ├── ComponentMultipleValue.ts # Table renderer (multi-record)
│   ├── DoubleComponent.ts     # Leaf: float input
│   ├── IntegerComponent.ts    # Leaf: integer input
│   ├── TextComponent.ts       # Leaf: text input
│   └── ListComponent.ts       # Leaf: select dropdown
├── contract/
│   ├── IComponent.ts          # IComponent interface + BuildConfig + ViewMode enum
│   ├── IComponentDefinition.ts # Shape of each JSON field definition
│   ├── IComponentSize.ts      # Width multiplier interface
│   ├── IChildComponent.ts     # Optional child contract
│   ├── IParentComponent.ts    # Listener + readValue contract
│   ├── IScreenReader.ts       # Read-side DOM abstraction
│   ├── IScreenWriter.ts       # Write-side DOM abstraction + enums
│   └── IScreenReaderWriter.ts # Combined read+write abstraction
├── factory/
│   ├── ComponentFactory.ts    # Creates IComponent from type string or schema
│   └── ComponentSizeFactory.ts # Parses size string → IComponentSize
├── implementations/
│   ├── HtmlDocumentReaderWriter.ts # Concrete DOM writer (creates elements)
│   ├── ElementFactory.ts      # Low-level element creators (div, input, table…)
│   ├── StyleFactory.ts        # Injects <style> tags as CSS classes
│   └── Themes.ts              # Theme definitions (CSS variable maps)
├── loader/
│   └── ComponentLoader.ts     # Iterates schema → creates IComponent[]
├── error/
│   └── Errors.ts              # UnsupportedComponentTypeError
└── debug/                     # Debug/dev utilities
```

---

## Key classes and responsibilities

### `PInteg` (index.ts)
Fluent builder exposed as the public API.

```
PInteg
  .setDivId(id)           → target DOM element
  .setMainSchema(schema)  → ComponentSchema JSON
  .setReadOnly()          → BuildConfig.readonly = true
  .setViewMultiple()      → BuildConfig.mode = ViewMode.Multiple
  .buildForm()            → renders single-record form
  .buildList()            → renders multi-record table
  .writeObject(value)     → IComponent.writeValue(value)
  .readObject()           → IComponent.readValue()
```

### `IComponent` (contract)

```typescript
interface IComponent {
  build(config: BuildConfig): void;
  writeValue(value: any): void;
  readValue(): any;
}
```

All renderable units implement this interface. It is the core abstraction.

### `ComponentSchema` (type alias)

```typescript
type ComponentSchema = Record<string, IComponentDefinition>;
// Example:
const schema: ComponentSchema = {
  name:  { type: 'text',    caption: 'Name',  size: 'M' },
  age:   { type: 'integer', caption: 'Age',   size: 'S'  },
  type:  { type: 'list',    caption: 'Type',  size: 'L'  },
};
```

### `BuildConfig`

```typescript
class BuildConfig {
  readonly: boolean = false;
  mode: ViewMode = ViewMode.Single;   // 'single' | 'multiple'
}
```

### `IScreenReaderWriter`
The seam between components and the DOM. Implemented by `HtmlDocumentReaderWriter`.
Components call methods like `createBasicField(...)`, `setValueByName(...)`, `getValueByElementName(...)`.
**This is the key interface to replace with React rendering.**

---

## Design patterns used

| Pattern | Where |
|---------|-------|
| **Composite** | `ComponentComposite`, `ComponentMultipleValue` |
| **Factory** | `ComponentFactory`, `ComponentSizeFactory` |
| **Strategy** | `IScreenReaderWriter` implementations |
| **Builder / Fluent API** | `PInteg`, `ScreenBuilder` |
| **Observer** | `addValueChangedListener` callbacks in `BasicComponent` |

---

## Data flow (current)

```
Consumer JSON schema
       ↓
PInteg.buildForm()
       ↓
ComponentFactory.createFromSchema(schema, HtmlDocumentReaderWriter)
       ↓
ComponentComposite.build(config)
       ↓  ←── ComponentLoader iterates schema fields
BasicComponent.build(config)
       ↓
HtmlDocumentReaderWriter.createBasicField(...)
       ↓
ElementFactory.createDiv / createInput / createLabel
       ↓
DOM mutation (element appended to target div)
```

---

## Themes system (current)

- `Themes.ts` defines three theme objects with CSS variable maps.
- `StyleFactory.themes(document)` injects `<style>` into `<head>` on first call.
- The root element gets class `root-style`; theme classes (`dark-theme`, `compact-theme`) are applied on top.
- CSS variable names follow the pattern `--color-primary`, `--input-height`, etc.
