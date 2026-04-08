# Project Conventions

This document outlines the coding and structural conventions for the PInteg monorepo.

## 📁 Directory Structure

### Tests
- **All tests** must be located in a `tst/` directory at the project/package root.
- The `tst/` directory should be a sibling to the `src/` directory.
- Example:
  - `packages/pinteg-react/src/` (Source code)
  - `packages/pinteg-react/tst/` (Test files)

### Distribution
- All build artifacts must be emitted to a `dist/` directory.
- Avoid using `out/` or emitting files directly into the `src/` directory.
