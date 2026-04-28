# 01 – Project Overview

## What is pinteg?

**pinteg** is a TypeScript library that generates CRUD screens (forms and tables) at runtime from a JSON schema. Consumers describe their data fields declaratively, and the library produces the full UI—including labels, inputs, dropdowns, and tables—on **any supported platform**.

## Long-term vision (3 phases)

| Phase | Goal | Status |
|-------|------|--------|
| **Phase A** | Rewrite the HTML renderer in React | 🔄 In progress |
| **Phase B** | Multi-platform: Desktop (Electron) and Mobile (React Native / iOS / Android) | 📋 Planned |
| **Phase C** | Plugin ecosystem: community-published npm packages for custom field types | 📋 Planned |

### Key capabilities (current)

| Feature | Description |
|---------|-------------|
| **Single-record form** | Renders a form from a `ComponentSchema` with vertical layout |
| **Multi-record table** | Renders a `<table>` from the same schema with horizontal column layout |
| **Field types** | `text`, `integer`, `double`, `list` (select / dropdown) |
| **Themes** | `light-theme` (default), `dark-theme`, `compact-theme` via CSS variables |
| **Read-only mode** | Inputs rendered as `disabled` / non-editable |
| **writeObject / readObject** | Programmatic value binding and extraction |
| **Custom types** | `registerSchema` allows composite field reuse |

---

## Why migrating to React?

| Pain point (current) | Benefit of React migration |
|----------------------|---------------------------|
| Imperative DOM manipulation via `HtmlDocumentReaderWriter` | Declarative rendering; React manages DOM diffs |
| State management scattered across `IComponent` instances | Centralized state via React hooks or context |
| Hard to compose with modern front-end stacks | Ships as standard React components; integrates with any React app |
| Testing requires a real DOM / JSDOM | Components are independently testable with React Testing Library |
| Theming via injected `<style>` tags | Theming via CSS variables + React Context |
| Re-renders require explicit `writeValue` calls | Props-driven rendering; React re-renders automatically |

---

## Phase A goals — React migration

1. **Preserve the JSON schema format** — existing consumer schemas work unchanged.
2. **Preserve all themes** — the three CSS-variable themes continue to work.
3. **Preserve all field types** — `text`, `integer`, `double`, `list`.
4. **Maintain both view modes** — `single` (form) and `multiple` (table).
5. **Maintain read-only mode**.
6. **Expose a clean React API** — `<PIntegForm>` and `<PIntegTable>` components.
7. **Follow SOLID principles** throughout the new implementation.
8. **Keep the library distributable** — publishable as an npm package.

## Phase B goals — Multi-platform

9. **Electron support** — wrap the React renderer in Electron for desktop apps (Windows, macOS, Linux) with zero code changes to the consumer's schema.
10. **React Native support** — a separate `pinteg-native` renderer implements the same `IFieldRenderer` contract using React Native primitives, enabling Android and iOS apps from the same schema.
11. **Platform-agnostic core** — the schema, registry, and composition logic lives in a shared `pinteg-core` package; renderers are platform-specific packages.

## Phase C goals — Plugin ecosystem

12. **Publishable custom types** — any developer can create a custom field type (e.g. `date-picker`, `currency`, `phone-number`), publish it to npm as `pinteg-field-<name>`, and other users install and use it with a single `register()` call.
13. **Schema-level type references** — custom types are declared in the JSON schema by their string name (e.g. `{ type: 'date-picker' }`); no code changes to the core are ever needed.
14. **Composable schemas** — complex types (e.g. an "address" group) can be defined as reusable schemas and shared as npm packages.
