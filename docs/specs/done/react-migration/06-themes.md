# 06 – Themes

## Overview

The theme system is **fully preserved** in the React migration. The CSS variable names, values, and three built-in themes (light, dark, compact) remain identical. Only the *injection mechanism* changes.

---

## Theme definitions (unchanged)

The `themes.ts` file is copied as-is from the current `src/implementations/Themes.ts`. No changes to variable names or values.

```typescript
// src/themes/themes.ts  (same data as current Themes.ts)
export interface Theme {
  id: string;
  name: string;
  properties: { [key: string]: string };
}

export const themes: Theme[] = [
  {
    id: 'light-theme',
    name: 'Light Theme',
    properties: {
      'color-primary':          '#007bff',
      'color-background':       '#ffffff',
      'color-text':             '#222222',
      'color-surface':          '#f5f5f5',
      'color-surface-alt':      '#f5f5f5',
      'color-surface-hover':    '#f9f9f9',
      'color-border':           '#cccccc',
      'color-border-subtle':    '#e0e0e0',
      'color-focus-border':     'var(--color-primary)',
      'color-focus-background': 'rgba(0, 123, 255, 0.1)',
      'input-width':  '500px',
      'input-height': '30px',
      'input-radius': '6px',
      'table-radius': '6px',
      'font-size':    '14px',
      'input-padding': '6px 8px',
    },
  },
  {
    id: 'dark-theme',
    name: 'Dark Theme',
    properties: {
      'color-primary':          '#009dff',
      'color-background':       '#121212',
      'color-text':             '#f1f1f1',
      'color-surface':          '#1e1e1e',
      'color-surface-alt':      '#1e1e1e',
      'color-surface-hover':    '#2a2a2a',
      'color-border':           '#444',
      'color-border-subtle':    '#333',
      'color-focus-border':     'var(--color-primary)',
      'color-focus-background': 'rgba(0, 157, 255, 0.15)',
      'input-width':  '500px',
      'input-height': '40px',
      'input-radius': '6px',
      'table-radius': '6px',
      'font-size':    '14px',
      'input-padding': '6px 8px',
    },
  },
  {
    id: 'compact-theme',
    name: 'Compact Theme',
    properties: {
      'color-primary':          '#d33682',
      'color-background':       '#fdf6e3',
      'color-text':             '#333333',
      'color-surface':          '#fff8dc',
      'color-surface-alt':      '#f0eada',
      'color-surface-hover':    '#f7f1e3',
      'color-border':           '#aaa',
      'color-border-subtle':    '#dcdcdc',
      'color-focus-border':     'var(--color-primary)',
      'color-focus-background': 'rgba(211, 54, 130, 0.1)',
      'input-width':  '500px',
      'input-height': '50px',
      'input-radius': '6px',
      'table-radius': '6px',
      'font-size':    '14px',
      'input-padding': '6px 8px',
    },
  },
];
```

---

## Injection mechanism (changed)

### Current (imperative)
`StyleFactory.themes(document)` injects a `<style>` tag into `document.head` with `:root { … }` and `.dark-theme { … }` blocks.

### React (declarative)
`ThemeProvider` converts the selected theme's properties map into an inline CSS variables object on a `<div>`. No `<style>` mutation needed.

```tsx
// src/themes/ThemeProvider.tsx
import React from 'react';
import { themes, Theme } from './themes';

export type ThemeId = 'light-theme' | 'dark-theme' | 'compact-theme' | string;

interface ThemeProviderProps {
  theme?: ThemeId;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme = 'light-theme', children }) => {
  const selected: Theme = themes.find(t => t.id === theme) ?? themes[0];

  // Build a style object with CSS custom properties
  const cssVars = Object.fromEntries(
    Object.entries(selected.properties).map(([key, value]) => [`--${key}`, value])
  ) as React.CSSProperties;

  return (
    <div className={`pinteg-root ${selected.id}`} style={cssVars}>
      {children}
    </div>
  );
};
```

### Why inline style instead of a CSS class?

Scoping. With a wrapper div carrying the CSS variables, the theme is **scoped to that subtree** — multiple independent `<PIntegForm>` instances with different themes can coexist on the same page without conflict, which was impossible with global `:root` injection.

---

## ThemeContext (optional, for deeply nested access)

If field components need the current theme ID (e.g., to choose an icon variant), expose it via Context:

```tsx
// src/themes/ThemeContext.tsx
import { createContext, useContext } from 'react';

export const ThemeContext = createContext<ThemeId>('light-theme');

export function useTheme(): ThemeId {
  return useContext(ThemeContext);
}
```

`ThemeProvider` wraps children in `<ThemeContext.Provider value={theme}>`.

---

## Adding a custom theme

Consumers can register an additional theme by appending to the `themes` array before mounting:

```typescript
import { themes } from 'pinteg/themes';

themes.push({
  id: 'brand-theme',
  name: 'Brand Theme',
  properties: {
    'color-primary':    '#e87722',
    'color-background': '#fff',
    // … rest of required properties …
  },
});
```

Then use `<PIntegRoot theme="brand-theme">`.

---

## CSS class names on field elements

The root provides CSS variables; field components apply standard class names (no dynamic style injection). A companion CSS file `pinteg.css` ships with the package and provides the static CSS rules:

```css
/* pinteg.css (shipped with package) */
.pinteg-root { 
  background: var(--color-background);
  color: var(--color-text);
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background 0.3s, color 0.3s;
}

.pinteg-field { display: flex; flex-direction: column; }
.pinteg-field--horizontal { flex-direction: row; }
.pinteg-label { font-size: calc(var(--font-size) - 2px); margin-bottom: 5px; }
.pinteg-input {
  height: var(--input-height);
  border-radius: var(--input-radius);
  border: 1px solid var(--color-border);
  padding: var(--input-padding);
  font-size: var(--font-size);
  background: var(--color-surface);
  color: var(--color-text);
  box-sizing: border-box;
}
.pinteg-input:focus {
  outline: none;
  border-color: var(--color-focus-border);
  background-color: var(--color-focus-background);
}
.pinteg-select { /* ... same as pinteg-input + custom arrow ... */ }
.pinteg-table { width: 100%; border-collapse: collapse; font-size: var(--font-size); }
.pinteg-table th { background: var(--color-surface-alt); padding: 12px 15px; }
.pinteg-table td { background: var(--color-surface); border: 1px solid var(--color-border); }
.pinteg-table tr:hover td { background: var(--color-focus-background); }
.pinteg-table-input { border: none; background: transparent; color: var(--color-text); }
```
