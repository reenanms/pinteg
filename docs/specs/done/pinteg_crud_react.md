# PInteg CRUD React

## Motivation
To accelerate the development of fully-featured administrative interfaces, we are introducing a new package called `pinteg-crud-react`. By leveraging `pinteg-react` for robust form/table UI generation and an upgraded `pinteg-data-source` for data interactions, this package provides a ready-to-use, platform-agnostic React CRUD system.

In the future, this package will act as a micro-frontend module. A centralized platform managing authentication and authorization will dynamically load this package upon route matching. Because of this, it must be fully decoupled and rely on relative/composable routing.

## Enhancing `pinteg-data-source`
Currently, `pinteg-data-source` only supports a single `resolve` method. To support full CRUD operations without backward compatibility, the manager will be refactored to accept a strongly typed `DataSource` interface where any single operation is optional:

```typescript
export interface DataSource<T = any> {
    read?: (params?: Record<string, any>) => Promise<T | T[]>;
    create?: (data: any, params?: Record<string, any>) => Promise<T>;
    update?: (key: string | number, data: any, params?: Record<string, any>) => Promise<T>;
    delete?: (key: string | number, params?: Record<string, any>) => Promise<void>;
}

export const DataSourceManager = {
    register(name: string, source: DataSource): void;
    resolve(name: string): DataSource;
};
```
This allows the UI to fetch the source via `resolve` and generically call `.read()`, `.create()`, etc.

## Package Architecture (`pinteg-crud-react`)
The CRUD package will generate two primary view modes:
1. **Listage Page**: A table view listing records.
2. **Edit/View/Create Page**: A form view for creating or updating a record.

### Features & Usability
- **Page Header**: Distinct Title and a small description for each screen.
- **Routing**: Internal routing handling navigation between standard CRUD operations.
- **Best Usability Principles**: Clear success/error feedback loops, confirmation dialogs for deletions, and intuitive "Cancel / Save" action bars.
- **SOLID Principles**: Components are tightly focused (Single Responsibility). Routing, Data Fetching, and Rendering are separated into distinct layers to easily invert dependencies.

### Route Structure
The component handles its own nested routing layout:
- `\` - **Listage**: Data table displaying all items from the data source.
- `\create` - **Create**: Empty form. Calls `DataSource.create` on submit.
- `\update\{key}` - **Update/Edit**: Fetches record `{key}`, populates the form, and calls `DataSource.update` on submit.
- `\delete\{key}` - **Delete**: Handled via action (e.g. modal prompt from the listage). The system will execute `DataSource.delete` before returning to the list view.

## Requirements & Conventions
- **Tests**: Mandatory unit tests placed in the `tst/` folder at the package root to ensure the data source interactions and UI logic are fully tested.
- **Conventions**: Strict adherence to `CONVENTIONS.md`. Build outputs must be placed in `dist/`.
- **Demo**: A demonstration project must be created (e.g. `apps/demo-crud-react`) to showcase the system fetching and writing to a mock data layer.
