# PInteg React Migration – Documentation Index

This folder contains all documentation for the **3-phase migration** of the pinteg library: React rewrite → multi-platform → plugin ecosystem.

## The 3-phase vision

| Phase | Goal | Docs |
|-------|------|------|
| **Phase A** | React rewrite (Web) | Files 01–08 |
| **Phase B** | Multi-platform: Electron desktop + React Native mobile | [10-multiplatform-roadmap.md](./10-multiplatform-roadmap.md) |
| **Phase C** | Plugin ecosystem: community npm packages for custom field types | [09-plugin-ecosystem.md](./09-plugin-ecosystem.md) |

---

## All documents

| # | File | Purpose |
|---|------|---------|
| 01 | [01-project-overview.md](./01-project-overview.md) | Vision, 3-phase goals, current capabilities |
| 02 | [02-current-architecture.md](./02-current-architecture.md) | Existing TypeScript classes, contracts, and patterns |
| 03 | [03-react-architecture.md](./03-react-architecture.md) | Monorepo structure, React architecture, SOLID design |
| 04 | [04-schema-and-contracts.md](./04-schema-and-contracts.md) | JSON Schema format, TypeScript contracts, data-flow |
| 05 | [05-component-mapping.md](./05-component-mapping.md) | How each existing class maps to a React component or hook |
| 06 | [06-themes.md](./06-themes.md) | Theme system migration (CSS variables → React Context + CSS) |
| 07 | [07-api-design.md](./07-api-design.md) | Public API: `<PIntegForm>`, `<PIntegTable>`, hooks, props |
| 08 | [08-implementation-plan.md](./08-implementation-plan.md) | 6-phase plan with steps, commands, and acceptance criteria |
| 09 | [09-plugin-ecosystem.md](./09-plugin-ecosystem.md) | How to author and publish community `pinteg-field-*` npm packages |
| 10 | [10-multiplatform-roadmap.md](./10-multiplatform-roadmap.md) | Electron desktop + React Native mobile architecture and roadmap |

---

## Quick summary

**Phase A (current):** Replaces the imperative HTML writer (`HtmlDocumentReaderWriter`) with React components. The `FieldRendererRegistry` is the key extensibility point — new field types register as plain React components, no core changes required.

**Phase B:** The codebase becomes a monorepo. `pinteg-core` (schema + registry) has zero platform dependencies. `pinteg-react` targets web/Electron; `pinteg-native` targets Android/iOS. The consumer's schema JSON and plugin `register()` calls are identical on all platforms.

**Phase C:** Any developer can publish a field type as `pinteg-field-<name>` on npm. Other users install and use it with one `register()` call. The `FieldRendererProps` interface is the stable, versioned contract that makes this possible.
