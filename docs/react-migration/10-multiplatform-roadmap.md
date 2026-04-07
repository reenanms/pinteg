# 10 – Multi-Platform Roadmap (Phase B)

This document describes how pinteg expands beyond the web browser to support **desktop (Windows, macOS, Linux)** via Electron and **mobile (Android, iOS)** via React Native.

---

## Key insight: only the renderer changes

The consumer's schema is **identical** across all platforms. The only thing that changes is which package they import:

```typescript
// Web / Electron app
import { PIntegForm, PIntegRoot } from 'pinteg-react';

// React Native app (Android / iOS)
import { NativeForm, PIntegNativeRoot } from 'pinteg-native';
```

The schema JSON, registered plugins, and `onChange` / `readValue` patterns are the same everywhere.

---

## Package dependency map

```
                    pinteg-core
                   (schema, registry, utils)
                  /          |          \
           pinteg-react  pinteg-native  [community plugins]
           (Web + Electron)  (Android + iOS)
```

**`pinteg-core`** — zero platform dependencies. Ships types and the `FieldRendererRegistry`. Any renderer (web, native, CLI, PDF…) can be built on top.

**`pinteg-react`** — depends on `pinteg-core` + `react` + `react-dom`. Used in browser apps and Electron renderer processes.

**`pinteg-native`** — depends on `pinteg-core` + `react` + `react-native`. Used in Expo and bare React Native apps.

---

## Desktop support: Electron

### How Electron works with pinteg-react

Electron apps have two processes:

| Process | Role | pinteg involvement |
|---------|------|--------------------|
| **Main process** (Node.js) | Opens windows, manages OS | None — pinteg doesn't run here |
| **Renderer process** (Chromium) | Renders the UI | `pinteg-react` runs here, just like in a browser |

**No changes are needed to `pinteg-react`** to support Electron. The renderer process is a full Chromium browser.

### Electron setup (demo app)

```
apps/demo-electron/
├── electron/
│   └── main.ts         ← Electron main process: creates BrowserWindow
├── src/                ← Vite React app (identical to web app)
│   └── App.tsx
├── package.json
└── vite.config.ts
```

```typescript
// electron/main.ts
import { app, BrowserWindow } from 'electron';
import path from 'path';

app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1200, height: 800 });

  // In development: Vite dev server
  win.loadURL('http://localhost:5173');

  // In production: bundled HTML
  // win.loadFile(path.join(__dirname, '../dist/index.html'));
});
```

```typescript
// src/App.tsx (identical to a web app)
import { PIntegRoot, PIntegForm } from 'pinteg-react';

const schema = {
  name:  { type: 'text',    caption: 'Name',  size: 'medium' },
  price: { type: 'double',  caption: 'Price', size: 'small'  },
};

export default function App() {
  const [value, setValue] = useState({});
  return (
    <PIntegRoot theme="dark-theme">
      <PIntegForm schema={schema} value={value} onChange={setValue} />
    </PIntegRoot>
  );
}
```

### Build and package

```bash
# Development
npx electron .

# Production build (creates .exe, .dmg, .deb)
npm run build        # Vite bundles the React app
npx electron-builder # Packages the Electron app
```

---

## Mobile support: React Native

### `pinteg-native` package structure

```
packages/pinteg-native/
├── src/
│   ├── registry/        ← Imports FieldRendererRegistry from pinteg-core
│   ├── components/
│   │   ├── NativeForm.tsx       ← <ScrollView> with field rendering
│   │   └── NativeTable.tsx      ← <FlatList> with column layout
│   ├── fields/
│   │   ├── NativeTextField.tsx      ← <TextInput keyboardType="default">
│   │   ├── NativeIntegerField.tsx   ← <TextInput keyboardType="numeric">
│   │   ├── NativeDoubleField.tsx    ← <TextInput keyboardType="decimal-pad">
│   │   └── NativeListField.tsx      ← Expo Picker or RN Picker
│   └── index.ts
├── package.json
└── tsconfig.json
```

### Native field component example

```tsx
// NativeTextField.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import type { FieldRendererProps } from 'pinteg-core';

export const NativeTextField: React.FC<FieldRendererProps> = ({
  name,
  caption,
  value,
  readOnly,
  tableMode,
  onChange,
}) => (
  <View style={styles.container}>
    {!tableMode && caption ? (
      <Text style={styles.label}>{caption}</Text>
    ) : null}
    <TextInput
      style={tableMode ? styles.tableInput : styles.input}
      value={value ?? ''}
      editable={!readOnly}
      onChangeText={(text) => onChange(name, text)}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 4, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10 },
  tableInput: { borderWidth: 1, borderColor: '#ccc', padding: 6 },
});
```

### Native consumer usage

```tsx
// App.tsx in a React Native / Expo project
import { NativeForm, registerNativeDefaults } from 'pinteg-native';

registerNativeDefaults(); // registers text, integer, double, list

const schema = {
  name:  { type: 'text',    caption: 'Name',  size: 'medium' },
  price: { type: 'double',  caption: 'Price', size: 'small'  },
};

export default function App() {
  const [value, setValue] = useState({});
  return (
    <NativeForm schema={schema} value={value} onChange={setValue} />
  );
}
```

### Platform differences handled by the renderer

| Concern | `pinteg-react` (Web) | `pinteg-native` (Mobile) |
|---------|---------------------|-----------------------|
| Input | `<input type="text">` | `<TextInput>` |
| Number input | `<input type="number">` | `<TextInput keyboardType="numeric">` |
| Dropdown | `<select>` | `@react-native-picker/picker` |
| Layout | flexbox `<div>` | `<View>` with StyleSheet |
| Table | `<table>` | `<FlatList>` |
| Theme | CSS variables via `style={}` | StyleSheet constants |

---

## Android-specific notes

- React Native runs as a native Android `.apk` / `.aab`
- Build command: `npx react-native run-android` (or `npx expo build:android` with Expo)
- All field types work on Android; `NativeListField` uses `@react-native-picker/picker`
- No Electron required for Android — React Native bridges to native views directly

## iOS-specific notes

- Requires macOS and Xcode to build
- Build command: `npx react-native run-ios`
- `NativeListField` can use the native `ActionSheetIOS` or the Picker component

---

## Roadmap timeline

| Milestone | Description | Depends on |
|-----------|-------------|------------|
| ✅ Phase A | React web library (`pinteg-react`) | — |
| Phase B.1 | Extract `pinteg-core` from `pinteg-react` | Phase A complete and stable |
| Phase B.2 | Electron demo (`apps/demo-electron`) | Phase B.1 |
| Phase B.3 | `pinteg-native` with 4 built-in fields | Phase B.1 |
| Phase B.4 | React Native demo working on Android | Phase B.3 |
| Phase C | Plugin ecosystem (`pinteg-field-*`) | Phase B.1 (needs stable core API) |
