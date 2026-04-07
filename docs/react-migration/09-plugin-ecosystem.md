# 09 – Plugin Ecosystem

Community developers can create, publish, and share custom pinteg field types as standalone npm packages.

## Core rule: Define once, run everywhere

> A plugin author writes their field type **once**. The same `pinteg-field-date` package works on Web, Electron, and React Native. The user never installs a different package per platform.

This is enforced by the plugin structure (see below) and by `pinteg-core` being platform-agnostic.

---

## How it works (user's perspective)

```bash
# 1. Install the community plugin — same package on all platforms
npm install pinteg-field-date

# 2. Register once, before rendering
import { registerDateField } from 'pinteg-field-date';
registerDateField();

# 3. Use in schema — identical on web AND mobile
const schema = {
  birthDate: { type: 'date', caption: 'Birth Date', size: 'medium' },
};
```

The user calls the **same import**, uses the **same schema**, and the system resolves the correct renderer (React DOM vs React Native) automatically.


---

## Core API in `pinteg-core`

### `FieldRendererProps` (stable public contract)

```typescript
// packages/pinteg-core/src/registry/FieldRendererProps.ts

export interface FieldRendererProps {
  /** Field key as defined in ComponentSchema */
  name: string;
  /** Human-readable label */
  caption: string;
  /** Current value (controlled) */
  value: any;
  /** Size hint: 'small' | 'medium' | 'large' | 'full' */
  size: string;
  /** If true, the field must not be editable */
  readOnly: boolean;
  /** True when rendering inside a table row (compact mode) */
  tableMode: boolean;
  /** Called when the value changes. Pass the field name + new value. */
  onChange: (name: string, value: any) => void;
  /** All extra properties from IComponentDefinition (e.g. options, min, max) */
  props: Record<string, any>;
}
```

> ⚠️ **This interface is the plugin contract.** Any breaking change to it requires a major semver bump in `pinteg-core`. All plugins declare `pinteg-core` as a peer dependency.

---

### `FieldRendererRegistry` (in `pinteg-core`)

```typescript
// packages/pinteg-core/src/registry/FieldRendererRegistry.ts

export type FieldRenderer<P = FieldRendererProps> = React.ComponentType<P>;

export class FieldRendererRegistry {
  private static renderers = new Map<string, FieldRenderer>();

  /** Register a renderer for a type string. Call before first render. */
  static register(type: string, renderer: FieldRenderer): void {
    this.renderers.set(type, renderer);
  }

  /** Look up a renderer. Throws if not found. */
  static get(type: string): FieldRenderer {
    const renderer = this.renderers.get(type);
    if (!renderer) throw new Error(
      `[pinteg] Unknown field type: "${type}". Did you forget to register a plugin?`
    );
    return renderer;
  }

  /** Check if a type is registered (useful for fallback logic). */
  static has(type: string): boolean {
    return this.renderers.has(type);
  }
}
```

---

### `createFieldPlugin` helper

```typescript
// packages/pinteg-core/src/registry/createFieldPlugin.ts

export function createFieldPlugin(
  type: string,
  component: FieldRenderer
): { register: () => void; type: string; component: FieldRenderer } {
  return {
    type,
    component,
    register: () => FieldRendererRegistry.register(type, component),
  };
}
```

This is the **official, recommended** way for plugin authors to export their plugin:

```typescript
// pinteg-field-date/src/index.ts
import { createFieldPlugin } from 'pinteg-core';
import { DateField } from './DateField';

const plugin = createFieldPlugin('date', DateField);

export const registerDateField = plugin.register;
export { DateField };
export default plugin;
```

---

## Anatomy of a plugin package ("write once" structure)

A plugin ships **both** renderers inside the same npm package, separated as subpath exports. The platform is resolved automatically at build time:

```
pinteg-field-date/
├── src/
│   ├── core/
│   │   └── DateFieldDef.ts       ← validation, default value, extra props type (shared, no platform)
│   ├── web/
│   │   └── DateField.web.tsx      ← React DOM renderer (uses <input type="date">)
│   ├── native/
│   │   └── DateField.native.tsx   ← React Native renderer (uses DateTimePicker)
│   └── index.ts                   ← re-exports register() — resolved per platform by package.json
├── package.json                   ← subpath exports choose web/ vs native/ automatically
├── vite.config.ts
├── tsconfig.json
├── README.md
└── src/__tests__/
    ├── DateField.web.test.tsx
    └── DateField.native.test.tsx
```

### How platform resolution works: `package.json` subpath exports

```json
{
  "name": "pinteg-field-date",
  "version": "1.0.0",
  "description": "Date field plugin for pinteg — Web + React Native",
  "exports": {
    ".": {
      "react-native": "./dist/native/index.js",
      "import":        "./dist/web/index.js",
      "require":       "./dist/web/index.cjs"
    }
  },
  "types": "./dist/web/index.d.ts",
  "peerDependencies": {
    "pinteg-core": ">=1.0.0 <2.0.0",
    "react": ">=18.0.0"
  },
  "peerDependenciesMeta": {
    "react-native": { "optional": true }
  },
  "keywords": ["pinteg", "pinteg-plugin", "field-type", "date"]
}
```

> **How it resolves:**
> - React Native bundlers (Metro, Expo) match `"react-native"` export first → gets the native renderer.
> - Web bundlers (Vite, webpack, esbuild) match `"import"` / `"require"` → gets the web renderer.
> - The user's code never changes. The package.json does the routing.

> **Convention:** All plugins use `pinteg-field-<type>` as the npm package name and include the `pinteg-plugin` keyword for discoverability.

---

## Writing the field renderers

### Shared definition (zero platform dependency)

The validation logic, default values, and extra props live in `core/` — never in the renderer:

```typescript
// src/core/DateFieldDef.ts
export const DATE_TYPE = 'date';

export function formatDate(value: any): string {
  return value ?? '';
}

export function parseDate(raw: string): string {
  return raw; // extend with validation as needed
}
```

### Web renderer (React DOM)

```tsx
// src/web/DateField.web.tsx
import React from 'react';
import type { FieldRendererProps } from 'pinteg-core';
import { formatDate, parseDate } from '../core/DateFieldDef';

export const DateField: React.FC<FieldRendererProps> = ({
  name, caption, value, size, readOnly, tableMode, onChange,
}) => (
  <div className="pinteg-field" data-size={size}>
    {!tableMode && caption && (
      <label className="pinteg-label" htmlFor={name}>{caption}</label>
    )}
    <input
      id={name}
      name={name}
      type="date"
      className={tableMode ? 'pinteg-table-input' : 'pinteg-input'}
      value={formatDate(value)}
      readOnly={readOnly}
      onChange={(e) => onChange(name, parseDate(e.target.value))}
    />
  </div>
);
```

### Native renderer (React Native)

```tsx
// src/native/DateField.native.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import type { FieldRendererProps } from 'pinteg-core';
import { formatDate, parseDate } from '../core/DateFieldDef';

export const DateField: React.FC<FieldRendererProps> = ({
  name, caption, value, readOnly, tableMode, onChange,
}) => (
  <View style={styles.container}>
    {!tableMode && caption
      ? <Text style={styles.label}>{caption}</Text>
      : null}
    <TextInput
      style={tableMode ? styles.tableInput : styles.input}
      value={formatDate(value)}
      editable={!readOnly}
      placeholder="YYYY-MM-DD"
      onChangeText={(text) => onChange(name, parseDate(text))}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label:     { fontSize: 13, marginBottom: 4, color: '#555' },
  input:     { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10 },
  tableInput:{ borderWidth: 1, borderColor: '#ccc', padding: 6 },
});
```

### Plugin entry point (same file, different bundle per platform)

```typescript
// src/index.ts  (built twice: once for web, once for native)
import { createFieldPlugin } from 'pinteg-core';
import { DateField } from './DateField'; // resolved by bundler: .web.tsx or .native.tsx

const plugin = createFieldPlugin('date', DateField);

export const registerDateField = plugin.register;
export { DateField };
export default plugin;
```

> **Key point:** The plugin author writes `import { DateField } from './DateField'` once. The bundler resolves `.web.tsx` for web builds and `.native.tsx` for native builds because Metro and Vite both respect file extension conventions (`.native.tsx` takes priority in React Native).

**Web renderer rules:**
- Use `pinteg-label`, `pinteg-input`, `pinteg-table-input`, `pinteg-field` class names so CSS variables from the active theme apply automatically.
- In `tableMode`, do **not** render the label.
- Always use `name` as both `id` and `name` on the input.
- Call `onChange(name, value)` — not `onChange(value)` alone.

**Native renderer rules:**
- Use `StyleSheet.create` — no CSS class names.
- In `tableMode`, do **not** render the label.
- Use the same `onChange(name, value)` signature.
- Shared validation/formatting logic must live in `core/`, never in the renderer.


---

## Composite schema plugins (advanced)

A plugin can also export a **reusable schema fragment** — these have no renderer and work identically on all platforms:

```typescript
// pinteg-schema-address/src/index.ts
import type { ComponentSchema } from 'pinteg-core';

export const addressSchema: ComponentSchema = {
  street:  { type: 'text',    caption: 'Street',    size: 'large'  },
  city:    { type: 'text',    caption: 'City',       size: 'medium' },
  zip:     { type: 'text',    caption: 'ZIP Code',   size: 'small'  },
  country: { type: 'list',    caption: 'Country',    size: 'medium' },
};
```

Consumer usage — identical on web and mobile:

```typescript
import { addressSchema } from 'pinteg-schema-address';

const customerSchema: ComponentSchema = {
  name: { type: 'text', caption: 'Name', size: 'medium' },
  ...addressSchema,   // spreads street, city, zip, country
};
```

Schema plugins have only one entry point — no subpath needed — since they contain no renderers.


---

## Summary: what the plugin author does vs what the system handles

| Responsibility | Plugin author | pinteg system |
|----------------|--------------|---------------|
| Field logic / validation | ✅ Write once in `src/core/` | — |
| Web renderer | ✅ Write in `src/web/` | — |
| Native renderer | ✅ Write in `src/native/` | — |
| Platform resolution | — | ✅ `package.json` exports + bundler convention |
| Type string routing | — | ✅ `FieldRendererRegistry` in `pinteg-core` |
| Theme integration | — | ✅ CSS variables (web) / StyleSheet context (native) |
| User installation | One package | — |
| User schema | One JSON | — |
| User registration | One `register()` call | — |

---

## Versioning and compatibility guarantees

| Contract | Versioning rule |
|----------|-----------------|
| `FieldRendererProps` interface | **Major** semver bump on any breaking change |
| `FieldRendererRegistry` API | **Major** semver bump on any breaking change |
| `createFieldPlugin` API | **Major** semver bump on any breaking change |
| New optional fields in `FieldRendererProps` | **Minor** bump (plugins ignore unknown props) |

Plugins should declare `pinteg-core` using a range that excludes the next major:

```json
"peerDependencies": { "pinteg-core": ">=1.0.0 <2.0.0" }
```
