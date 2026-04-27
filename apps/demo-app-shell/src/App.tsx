import React from 'react';
import { DataSourceManager } from 'pinteg-data-source';
import { AppShell, AppShellConfig } from 'pinteg-app-shell';
import { PageDefinition } from 'pinteg-app-shell';
import { CrudConfig } from 'pinteg-crud-react';

// ================================================================
// Mock Data Stores
// ================================================================

let usersData = [
    { id: 1, name: 'Alice Johnson', role: 'admin', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', role: 'user', email: 'bob@example.com' },
    { id: 3, name: 'Carol White', role: 'editor', email: 'carol@example.com' },
];

let rolesData = [
    { id: 1, name: 'Administrator', level: 'full' },
    { id: 2, name: 'Editor', level: 'partial' },
    { id: 3, name: 'Viewer', level: 'read-only' },
];

let productsData = [
    { id: 1, name: 'Widget Pro', category: 'Widgets', price: '29.99' },
    { id: 2, name: 'Gadget Max', category: 'Gadgets', price: '49.99' },
    { id: 3, name: 'Tool Set', category: 'Tools', price: '99.99' },
];

let ordersData = [
    { id: 1, customer: 'Alice Johnson', product: 'Widget Pro', status: 'shipped' },
    { id: 2, customer: 'Bob Smith', product: 'Gadget Max', status: 'pending' },
    { id: 3, customer: 'Carol White', product: 'Tool Set', status: 'delivered' },
];

// ================================================================
// Generic CRUD handler factory
// ================================================================

function registerCrud(prefix: string, getData: () => any[], setData: (d: any[]) => void, pkField: string = 'id') {
    DataSourceManager.register(`${prefix}.list`, async () => [...getData()]);

    DataSourceManager.register(`${prefix}.get`, async (params: any) => {
        const record = getData().find((r: any) => String(r[pkField]) === params.key);
        if (!record) throw new Error('Record not found');
        return record;
    });

    DataSourceManager.register(`${prefix}.create`, async (data: any) => {
        const newRecord = { ...data, [pkField]: Date.now() };
        setData([...getData(), newRecord]);
        return newRecord;
    });

    DataSourceManager.register(`${prefix}.update`, async (params: any) => {
        const { key, ...data } = params;
        const items = getData();
        const index = items.findIndex((r: any) => String(r[pkField]) === key);
        if (index === -1) throw new Error('Record not found');
        items[index] = { ...items[index], ...data };
        setData([...items]);
        return items[index];
    });

    DataSourceManager.register(`${prefix}.delete`, async (params: any) => {
        setData(getData().filter((r: any) => String(r[pkField]) !== params.key));
    });
}

// Register CRUD operations for each entity
registerCrud('users', () => usersData, d => { usersData = d; });
registerCrud('roles', () => rolesData, d => { rolesData = d; });
registerCrud('products', () => productsData, d => { productsData = d; });
registerCrud('orders', () => ordersData, d => { ordersData = d; });

// ================================================================
// Schema DSM sources
// ================================================================

DataSourceManager.register('users.schema.list', async () => ({
    name:  { type: 'text', caption: 'Full Name', size: 'L' },
    role:  { type: 'text', caption: 'Role', size: 'S' },
    email: { type: 'text', caption: 'Email', size: 'M' },
}));

DataSourceManager.register('users.schema.detail', async () => ({
    name:  { type: 'text', caption: 'Full Name', size: 'L' },
    role:  {
        type: 'list', caption: 'System Role', size: 'M',
        options: [
            { key: 'admin', caption: 'Administrator' },
            { key: 'user', caption: 'Regular User' },
            { key: 'editor', caption: 'Editor' },
        ]
    },
    email: { type: 'text', caption: 'Email Address', size: 'L' },
}));

DataSourceManager.register('roles.schema.list', async () => ({
    name:  { type: 'text', caption: 'Role Name', size: 'L' },
    level: { type: 'text', caption: 'Access Level', size: 'M' },
}));

DataSourceManager.register('roles.schema.detail', async () => ({
    name:  { type: 'text', caption: 'Role Name', size: 'L' },
    level: {
        type: 'list', caption: 'Access Level', size: 'M',
        options: [
            { key: 'full', caption: 'Full Access' },
            { key: 'partial', caption: 'Partial Access' },
            { key: 'read-only', caption: 'Read Only' },
        ]
    },
}));

DataSourceManager.register('products.schema.list', async () => ({
    name:     { type: 'text', caption: 'Product Name', size: 'L' },
    category: { type: 'text', caption: 'Category', size: 'M' },
    price:    { type: 'text', caption: 'Price ($)', size: 'S' },
}));

DataSourceManager.register('products.schema.detail', async () => ({
    name:     { type: 'text', caption: 'Product Name', size: 'L' },
    category: {
        type: 'list', caption: 'Category', size: 'M',
        options: [
            { key: 'Widgets', caption: 'Widgets' },
            { key: 'Gadgets', caption: 'Gadgets' },
            { key: 'Tools', caption: 'Tools' },
        ]
    },
    price: { type: 'text', caption: 'Price ($)', size: 'S' },
}));

DataSourceManager.register('orders.schema.list', async () => ({
    customer: { type: 'text', caption: 'Customer', size: 'L' },
    product:  { type: 'text', caption: 'Product', size: 'M' },
    status:   { type: 'text', caption: 'Status', size: 'S' },
}));

DataSourceManager.register('orders.schema.detail', async () => ({
    customer: { type: 'text', caption: 'Customer Name', size: 'L' },
    product:  { type: 'text', caption: 'Product', size: 'M' },
    status:   {
        type: 'list', caption: 'Order Status', size: 'M',
        options: [
            { key: 'pending', caption: 'Pending' },
            { key: 'shipped', caption: 'Shipped' },
            { key: 'delivered', caption: 'Delivered' },
            { key: 'cancelled', caption: 'Cancelled' },
        ]
    },
}));

// ================================================================
// Per-page CrudConfig sources
// ================================================================

const fullAccess = {
    readList: true,
    readDetail: true,
    create: true,
    update: true,
    delete: true,
};

DataSourceManager.register('page.users.config', async (): Promise<CrudConfig> => ({
    title: 'User Management',
    description: 'Create, view, and manage user accounts across the system.',
    schema: { list: 'users.schema.list', detail: 'users.schema.detail' },
    dataSource: { list: 'users.list', get: 'users.get', create: 'users.create', update: 'users.update', delete: 'users.delete' },
    primaryKeyField: 'id',
    accessControl: fullAccess,
}));

DataSourceManager.register('page.roles.config', async (): Promise<CrudConfig> => ({
    title: 'Role Management',
    description: 'Define and manage user roles and access levels.',
    schema: { list: 'roles.schema.list', detail: 'roles.schema.detail' },
    dataSource: { list: 'roles.list', get: 'roles.get', create: 'roles.create', update: 'roles.update', delete: 'roles.delete' },
    primaryKeyField: 'id',
    accessControl: fullAccess,
}));

DataSourceManager.register('page.products.config', async (): Promise<CrudConfig> => ({
    title: 'Product Catalog',
    description: 'Browse and manage the product catalog with pricing.',
    schema: { list: 'products.schema.list', detail: 'products.schema.detail' },
    dataSource: { list: 'products.list', get: 'products.get', create: 'products.create', update: 'products.update', delete: 'products.delete' },
    primaryKeyField: 'id',
    accessControl: fullAccess,
}));

DataSourceManager.register('page.orders.config', async (): Promise<CrudConfig> => ({
    title: 'Order Management',
    description: 'Track and manage customer orders and their statuses.',
    schema: { list: 'orders.schema.list', detail: 'orders.schema.detail' },
    dataSource: { list: 'orders.list', get: 'orders.get', create: 'orders.create', update: 'orders.update', delete: 'orders.delete' },
    primaryKeyField: 'id',
    accessControl: fullAccess,
}));

// ================================================================
// Page Registry – R7: at least 2 groups with 2+ pages each
// ================================================================

DataSourceManager.register('app.pages', async (): Promise<PageDefinition[]> => [
    { id: 'users', title: 'Users', group: 'Administration', configSource: 'page.users.config' },
    { id: 'roles', title: 'Roles', group: 'Administration', configSource: 'page.roles.config' },
    { id: 'products', title: 'Products', group: 'Catalog', configSource: 'page.products.config' },
    { id: 'orders', title: 'Orders', group: 'Catalog', configSource: 'page.orders.config' },
]);

// ================================================================
// App Shell Configuration
// ================================================================

const shellConfig: AppShellConfig = {
    pageRegistry: 'app.pages',
    title: 'PInteg Corporate Portal',
    logoUrl: '/logo.svg',
};

function App() {
    return <AppShell config={shellConfig} />;
}

export default App;
