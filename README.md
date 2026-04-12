# 🚀 PInteg Monorepo
> **Dynamic Runtime CRUD Generation for Modern Web & Desktop Apps.**

PInteg is a high-performance, schema-driven ecosystem designed to eliminate the boilerplate of building management interfaces. By utilizing a platform-agnostic core and specialized React bindings, PInteg allows developers to generate complex, theme-aware, and responsive CRUD (Create, Read, Update, Delete) screens directly from JSON configurations.

Whether you are building a lightning-fast internal tool, a comprehensive SaaS platform, or a cross-platform Electron app, PInteg provides the architectural foundation for a consistent and professional user experience.

---

## ✨ Key Features
- **⚛️ React First**: Native React components designed for performance and deep customization.
- **🎨 Modern Aesthetics**: Built-in support for Dark/Light modes, Glassmorphism, and smooth animations.
- **📱 Responsive by Design**: Table-to-card transitions ensure your management tools work perfectly on mobile.
- **💾 Data-Agnostic**: A specialized `DataSourceManager` that abstracts away API, Database, or File System logic.
- **🛡️ Safety & Usability**: In-place action confirmations (no popups) and robust parameter validation.
- **🧱 Extensible Architecture**: Plug-in custom field types or renderers without modifying the core engine.

---

## 🧱 Project Structure
This repository is managed as a workspace-based monorepo for maximum modularity:

### 📦 Packages
- **`packages/pinteg-core`**: The logic-heavy heart of the system. Handles schema parsing and rendering orchestration.
- **`packages/pinteg-react`**: The UI engine. Contains form-ready fields, tables, themes, and base components.
- **`packages/pinteg-crud-react`**: The highest level of abstraction. Manages routing, breadcrumbs, and layout templates for CRUD pages.
- **`packages/pinteg-data-source`**: The connectivity layer. Allows registration of standardized data providers.

### 🚀 Applications
- **`apps/demo-crud-react`**: The primary showcase app demonstrating the full-stack CRUD capabilities.

---

## 🛠️ Getting Started

### For Consumers (using NPM)
Standard integration into your existing React project:
```sh
npm install @pinteg/react @pinteg/crud-react @pinteg/data-source
```

### For Developers (Local Sandbox)
To explore or contribute to the ecosystem:

1. **Clone & Setup**:
   ```sh
   git clone https://github.com/your-repo/pinteg.git
   cd pinteg
   npm install
   ```

2. **Run the Showcase**:
   ```sh
   cd apps/demo-crud-react
   npm run dev
   ```

---

## 🚀 Quick Start Example
Here is how you can set up a fully functional User Management CRUD in minutes:

### 1. Define your Schema & Config
```tsx
import { CrudConfig } from '@pinteg/crud-react';

const userConfig: CrudConfig = {
    title: 'User Manager',
    dataSourceName: 'userSource',
    primaryKeyField: 'id',
    schema: {
        name: { type: 'text', caption: 'Full Name', size: 'L' },
        email: { type: 'text', caption: 'Email Address', size: 'L' },
    }
};
```

### 2. Register your Data Provider
```tsx
import { DataSourceManager } from '@pinteg/data-source';

DataSourceManager.register('userSource', {
    read: async () => [{ id: 1, name: 'Alice' }],
    create: async (data) => ({ id: Math.random(), ...data }),
    update: async (id, data) => ({ id, ...data }),
    delete: async (id) => console.log('Deleted', id)
});
```

### 3. Mount the CRUD Router
```tsx
import { CrudProvider, CrudRouter } from '@pinteg/crud-react';
import { ThemeProvider, PIntegRoot } from '@pinteg/react';

function App() {
    return (
        <ThemeProvider>
            <PIntegRoot>
                <CrudProvider config={userConfig}>
                    <CrudRouter />
                </CrudProvider>
            </PIntegRoot>
        </ThemeProvider>
    );
}
```

---

## 📜 Engineering Standards
This project follows strict coding and usability conventions to ensure long-term maintainability. 
- **100% Package Coverage**: All critical packages must have full unit test suites.
- **No Native Popups**: We utilize sophisticated, in-place interactions for user confirmation.
- **SOLID Principles**: Focused on Single Responsibility and Dependency Inversion.

See **[CONVENTIONS.md](./CONVENTIONS.md)** for detailed developer guidelines.

---

## 📄 License
This project is licensed under the **MIT License**. See the `LICENSE` file for full details.


