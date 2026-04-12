# Project Conventions

This document outlines the coding and structural conventions for the PInteg monorepo.

## 📁 Directory Structure

### Workspace Organization
- **`packages/`**: Contains all reusable libraries, core modules, and data sources (e.g., `pinteg-core`, `pinteg-react`).
- **`apps/`**: Contains all standalone applications, including demo implementations and final platforms.
- **`docs/`**: Contains all architectural documentation, templates, and project guidelines.

### Inside Projects
- **Source Code**: All application and package source code must reside strictly in the `src/` folder.
- **Tests**: All tests must be located in a `tst/` directory at the project/package root. It must be a sibling to the `src/` directory. 
  - *Example*: `packages/pinteg-react/src/` (Source) and `packages/pinteg-react/tst/` (Tests).
- **Scripts**: Auxiliary scripts, automations, and build helpers should be housed in a `scripts/` folder.
- **Distribution**: All compiled build artifacts must be emitted to a `dist/` directory. Avoid using `out/` or emitting files directly into development paths.

## 💻 Engineering Principles

### SOLID Principles
All code within the monorepo must strictly adhere to the SOLID principles of software design:
1. **Single Responsibility**: Each module, function, or React component should tackle a single aspect of functionality.
2. **Open/Closed**: Software entities must be open for extension (e.g., via the Data Source Manager or Plugins) but closed for core modification.
3. **Liskov Substitution**: Interfaces and base classes must be substitutable by their implementations without breaking expectations.
4. **Interface Segregation**: Create focused, granular interfaces (e.g., separate CRUD operations when not all are required) rather than large, monolithic ones.
5. **Dependency Inversion**: High-level systems (like UI components) should rely on abstractions (like the `DataSource` interface) instead of importing concrete low-level implementations directly.

### Usability Principles
For all user-facing interfaces (React components, apps, etc.), high usability standards must be applied:
- **Feedback & State**: Always provide immediate, clear feedback for user actions (loading spinners, error banners, success modals).
- **Safety & Forgiveness**: Destructive actions (like delete) must require confirmation. Provide clear paths for users to "Cancel" or "Go Back."
- **Consistency**: Utilize the centralized theming and standardized size constraints so the entire ecosystem feels cohesive.
- **Clarity**: Keep forms, tables, and actions intuitive. Use standard icons and clear typography for read-only vs. editable states.
