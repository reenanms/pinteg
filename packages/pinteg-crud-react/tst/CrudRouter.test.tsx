import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { CrudProvider, CrudConfig } from '../src/CrudContext';
import { CrudRouter } from '../src/CrudRouter';
import { DataSourceManager } from 'pinteg-data-source';

describe('CrudRouter', () => {
    const mockConfig: CrudConfig = {
        title: 'Test CRUD',
        description: 'Test Description',
        schema: {
            list:   'router.schema.list',
            detail: 'router.schema.detail',
        },
        dataSource: {
            list:   'router.list',
            get:    'router.get',
            create: 'router.create',
            update: 'router.update',
            delete: 'router.delete',
        },
        primaryKeyField: 'id',
        accessControl: {
            readList:   true,
            readDetail: true,
            create:     true,
            update:     true,
            delete:     true,
        },
    };

    beforeAll(() => {
        DataSourceManager.register('router.schema.list',   async () => ({ name: { type: 'text', caption: 'Name' } }));
        DataSourceManager.register('router.schema.detail', async () => ({ name: { type: 'text', caption: 'Name' } }));
        DataSourceManager.register('router.list',   async () => [{ id: 1, name: 'Alice' }]);
        DataSourceManager.register('router.get',    async () => ({ id: 1, name: 'Alice' }));
        DataSourceManager.register('router.create', async (d: any) => d);
        DataSourceManager.register('router.update', async (d: any) => d);
        DataSourceManager.register('router.delete', async () => {});
    });

    it('renders ListagePage by default', async () => {
        render(
            <CrudProvider config={mockConfig}>
                <CrudRouter />
            </CrudProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 2, name: /Test CRUD/i })).toBeDefined();
            expect(screen.getByText(/Test Description/i)).toBeDefined();
            expect(screen.getByText(/Create New/i)).toBeDefined();
        }, { timeout: 4000 });
    });
});
