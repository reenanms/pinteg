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
- **Test Coverage**: **Mandatory.** All packages in `packages/` must have 100% of their code covered by unit tests.
- **Exception for Demos**: Demo projects (`apps/`) are exempt from mandatory tests as they serve solely as consumption samples and debug environments.
- **Scripts**: Auxiliary scripts and build helpers should be housed in a `scripts/` folder.
- **Distribution**: All build artifacts must be emitted to a `dist/` directory. 

## 💻 Engineering Principles

### Coding Best Practices
- **Early Returns**: All functions should use the "Early Return" pattern to improve readability and reduce nested logic. Prefer early returns.
- **Exceptions for Readability**: Prefer using exceptions to keep code more readable.
- **Small Contextual Functions**: Keep functions small with names that make sense in the context.
- **Parameter Validation**: If an expected parameter is not received or is invalid, the function must throw an explicit exception or error immediately.
- **Dependency Management**: **Critical.** Dependencies must be managed via the root `package.json` in this monorepo. Never run `npm install` inside individual package or app folders to avoid breaking local workspace links and symlinks.

### SOLID Principles
All code must strictly adhere to SOLID:
1. **Single Responsibility**: Each module/function/component handles one functionality.
2. **Open/Closed**: Open for extension (data sources/plugins), closed for core modification.
3. **Liskov Substitution**: Interfaces must be substitutable by implementations.
4. **Interface Segregation**: Use granular interfaces rather than monolithic ones.
5. **Dependency Inversion**: High-level systems rely on abstractions.

### Usability Principles
- **No Popups**: **Strict Rule.** Do not use browser-native `confirm()`, `alert()`, or intrusive popups for UI interactions. Use in-place confirmation buttons or in-app modals.
- **Feedback & State**: Provide immediate feedback (loading, errors, success).
- **Consistency**: Use centralized theming and standardized size constraints.
- **Safety**: Destructive actions must require non-intrusive confirmation (e.g., two-stage buttons).

## 📄 Documentation
- **README.md**: Must be kept up to date with the latest features, installation steps, and architectural changes.
- **CONVENTIONS.md**: Must be updated as the project evolves to capture all necessary conversions and future standards.
