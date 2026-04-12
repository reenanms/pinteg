import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { CrudProvider, CrudConfig } from '../src/CrudContext';
import { CrudRouter } from '../src/CrudRouter';
import { DataSourceManager } from 'pinteg-data-source';

describe('CrudRouter', () => {
    const mockConfig: CrudConfig = {
        title: 'Test CRUD',
        description: 'Test Description',
        schema: {
            name: { type: 'text', caption: 'Name' }
        },
        dataSourceName: 'mockSource',
        primaryKeyField: 'id'
    };

    beforeAll(() => {
        DataSourceManager.register('mockSource', {
            read: async () => [{ id: 1, name: 'Alice' }],
            create: async (data) => data,
            update: async (id, data) => data,
            delete: async (id) => { }
        });
    });

    it('renders ListagePage by default', async () => {
        render(
            <CrudProvider config={mockConfig}>
                <CrudRouter />
            </CrudProvider>
        );

        // Wait for everything to settle and verify content (handles act internaly)
        await waitFor(() => {
            expect(screen.getByText(/Test CRUD/i)).toBeDefined();
            expect(screen.getByText(/Test Description/i)).toBeDefined();
            expect(screen.getByText(/Create New/i)).toBeDefined();
        }, { timeout: 4000 });
    });
});
