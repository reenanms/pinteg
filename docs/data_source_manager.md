# PInteg Data Source Manager

## Motivation
To provide maximum flexibility when building forms and tables, we need a unified **Data Source Manager** package. This package will allow developers to register custom data sources by name and consume them directly from the PInteg XML Layout definitions.

## Key Features
- **Register Data Sources**: Developers can register a data source using a unique name and a resolver function.
- **Consumption in XML**: Users can reference a registered data source in the XML layout by its name, optionally passing parameters.
- **Source Agnostic**: Data could originate from a REST API, a database, local files, or static data. The Data Source Manager simply calls the registered function, leaving the implementation details to the developer.
- **Future-proofing `list`**: In the future, the current static `list` options configuration will be refactored to use this new data source mechanism, creating a unified flow for all options.

## Proposed API

### 1. Registering a Data Source

The developer specifies a name and an async resolver function. The function will receive optionally explicitly defined parameters from the XML context.

```typescript
import { DataSourceManager } from '@pinteg/data-source';

// Registering a REST API data source
DataSourceManager.register('fetchUsers', async (params) => {
  const response = await fetch(`/api/users?role=${params.role}`);
  return response.json();
});

// Registering a static or database-driven data source
DataSourceManager.register('countryList', async () => {
  return [
    { label: 'Brazil', value: 'BR' },
    { label: 'United States', value: 'US' }
  ];
});
```

### 2. Using the Data Source in XML

The data source is referenced from the XML by the registered name. Parameters can be provided to filter or customize the data.

```xml
<!-- Example with parameters -->
<field name="userId" type="select" label="User">
  <source name="fetchUsers">
    <param name="role" value="admin" />
  </source>
</field>

<!-- Example without parameters -->
<field name="country" type="select" label="Country">
  <source name="countryList" />
</field>
```

### 3. Resolver Function Interface

The resolver function must conform to a predictable signature:

```typescript
type DataSourceResolver<T = any> = (params?: Record<string, any>) => Promise<T>;

interface DataSourceManager {
  register(name: string, resolver: DataSourceResolver): void;
  resolve(name: string, params?: Record<string, any>): Promise<any>;
}
```

## Migration Path: Refactoring `list`
Currently, fields use a static `list` concept to define dropdown options. Once the Data Source Manager is implemented, we are going to change the `list` option to consume data directly from this new manager, treating static lists as just another registered source under the hood.
