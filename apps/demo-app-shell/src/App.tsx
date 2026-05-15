import React from 'react';
import { DataSourceManager } from 'pinteg-data-source';
import { AppShell, AppShellConfig, PageDefinition, PortalDefinition } from 'pinteg-app-shell';
import { CrudConfig } from 'pinteg-crud-react';
import 'pinteg-formula-field';

// ================================================================
// Mock Data Stores
// ================================================================

const API_BASE = import.meta.env.VITE_API_BASE;

// ================================================================
// Generic CRUD handler factory
// ================================================================

function registerCrud(prefix: string, _pkField: string = 'id') {
    const url = `${API_BASE}/${prefix}`;

    DataSourceManager.register(`${prefix}.list`, async () => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${prefix} list`);
        return response.json();
    });

    DataSourceManager.register(`${prefix}.get`, async (params: any) => {
        const response = await fetch(`${url}/${params.key}`);
        if (!response.ok) throw new Error(`Failed to fetch ${prefix} record`);
        return response.json();
    });

    DataSourceManager.register(`${prefix}.create`, async (data: any) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to create ${prefix} record`);
        return response.json();
    });

    DataSourceManager.register(`${prefix}.update`, async (params: any) => {
        const { key, ...data } = params;
        const response = await fetch(`${url}/${key}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to update ${prefix} record`);
        return response.json();
    });

    DataSourceManager.register(`${prefix}.delete`, async (params: any) => {
        const response = await fetch(`${url}/${params.key}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Failed to delete ${prefix} record`);
    });
}

// Register CRUD operations for each entity
registerCrud('users');
registerCrud('roles');
registerCrud('products');
registerCrud('orders');

// ================================================================
// Schema DSM sources
// ================================================================

DataSourceManager.register('users.schema.list', async () => ({
    name: { type: 'text', caption: 'Full Name', size: 'L' },
    role: { type: 'text', caption: 'Role', size: 'S' },
    email: { type: 'text', caption: 'Email', size: 'M' },
}));

DataSourceManager.register('users.schema.detail', async () => ({
    userBadge: {
        type: 'formula',
        caption: 'User Badge',
        size: 'L',
        props: { formula: '[${UPPER(role)}] - ${name}' }
    },
    name: { type: 'text', caption: 'Full Name', size: 'L' },
    role: {
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
    name: { type: 'text', caption: 'Role Name', size: 'L' },
    level: { type: 'text', caption: 'Access Level', size: 'M' },
}));

DataSourceManager.register('roles.schema.detail', async () => ({
    name: { type: 'text', caption: 'Role Name', size: 'L' },
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
    name: { type: 'text', caption: 'Product Name', size: 'L' },
    category: { type: 'text', caption: 'Category', size: 'M' },
    price: { type: 'text', caption: 'Price ($)', size: 'S' },
    total: { type: 'formula', caption: 'Total', size: 'S', props: { formula: '${price}' } },
}));

DataSourceManager.register('products.schema.detail', async () => ({
    name: { type: 'text', caption: 'Product Name', size: 'L' },
    category: {
        type: 'list', caption: 'Category', size: 'M',
        options: [
            { key: 'Widgets', caption: 'Widgets' },
            { key: 'Gadgets', caption: 'Gadgets' },
            { key: 'Tools', caption: 'Tools' },
        ]
    },
    price: { type: 'double', caption: 'Base Price ($)', size: 'S' },
    tax: { type: 'double', caption: 'Tax (%)', size: 'S' },
    total: {
        type: 'formula',
        caption: 'Total Price (Calc)',
        size: 'L',
        props: { formula: '${SUM(price, (price * tax / 100))}' }
    },
}));

DataSourceManager.register('orders.schema.list', async () => ({
    summary: { 
        type: 'formula', 
        caption: 'Order Summary', 
        size: 'L', 
        props: { formula: 'Order for ${UPPER(customer)}' } 
    },
    product: { type: 'text', caption: 'Product', size: 'M' },
    status: { type: 'text', caption: 'Status', size: 'S' },
}));

DataSourceManager.register('orders.schema.detail', async () => ({
    customer: { type: 'text', caption: 'Customer Name', size: 'L' },
    product: { type: 'text', caption: 'Product', size: 'M' },
    quantity: { type: 'double', caption: 'Quantity', size: 'S' },
    unitPrice: { type: 'double', caption: 'Unit Price ($)', size: 'S' },
    discount: { type: 'double', caption: 'Discount (%)', size: 'S' },
    subtotal: {
        type: 'formula',
        caption: 'Subtotal',
        size: 'M',
        props: { formula: '${quantity * unitPrice}' }
    },
    total: {
        type: 'formula',
        caption: 'Total with Discount',
        size: 'L',
        props: { formula: '${IF(discount > 0, (quantity * unitPrice * (1 - discount / 100)), (quantity * unitPrice))}' }
    },
    status: {
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

DataSourceManager.register('app.store.pages', async (): Promise<PageDefinition[]> => [
    { id: 'products', title: 'Products', group: 'Catalog', configSource: 'page.products.config' },
    { id: 'orders', title: 'Orders', group: 'Catalog', configSource: 'page.orders.config' },
]);

// ================================================================
// Portal Registry
// ================================================================

DataSourceManager.register('app.portals', async (): Promise<PortalDefinition[]> => [
    {
        id: 'corp',
        title: 'Corporate Management',
        description: 'Internal tool for managing users and roles.',
        icon: '🏢',
        pageRegistry: 'app.pages'
    },
    {
        id: 'store',
        title: 'Store Operations',
        description: 'Manage product catalog and customer orders.',
        icon: '🏪',
        pageRegistry: 'app.store.pages'
    }
]);

// ================================================================
// App Shell Configuration
// ================================================================

const shellConfig: AppShellConfig = {
    portalRegistry: 'app.portals',
    title: 'PInteg Gateway',
    logoUrl: '/logo.svg',
};

function App() {
    return <AppShell config={shellConfig} />;
}

export default App;
