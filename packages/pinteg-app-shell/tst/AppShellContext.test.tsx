import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { DataSourceManager } from 'pinteg-data-source';
import { AppShellProvider, useAppShell } from '../src/AppShellContext';
import { AppShellConfig, PageDefinition } from '../src/types';

/** Helper component that exposes context values via test IDs. */
const ContextInspector = () => {
    const { pages, activePage, activePageConfig, loading, error, setActivePage, clearActivePage } = useAppShell();
    return (
        <div>
            <span data-testid="pages-count">{pages.length}</span>
            <span data-testid="loading">{String(loading)}</span>
            <span data-testid="error">{error}</span>
            <span data-testid="active-page">{activePage?.id ?? 'none'}</span>
            <span data-testid="active-config">{activePageConfig?.title ?? 'none'}</span>
            <button data-testid="clear-active" onClick={clearActivePage}>Clear</button>
            {pages.map(p => (
                <button key={p.id} data-testid={`select-${p.id}`} onClick={() => setActivePage(p.id)}>
                    {p.title}
                </button>
            ))}
        </div>
    );
};

describe('AppShellProvider', () => {
    const mockPages: PageDefinition[] = [
        { id: 'users', title: 'Users', group: 'Administration', configSource: 'test.users.config' },
        { id: 'products', title: 'Products', group: 'Catalog', configSource: 'test.products.config' },
    ];

    const config: AppShellConfig = {
        pageRegistry: 'test.pages',
        title: 'Test App',
    };

    beforeEach(() => {
        // Clear previously registered sources and reset hash
        DataSourceManager._sources.clear();
        window.location.hash = '';
    });

    it('loads the page registry from DSM (R1)', async () => {
        DataSourceManager.register('test.pages', async () => mockPages);

        render(
            <AppShellProvider config={config}>
                <ContextInspector />
            </AppShellProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('pages-count').textContent).toBe('2');
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
    });

    it('sets error when page registry DSM key fails (R5)', async () => {
        DataSourceManager.register('test.pages', async () => {
            throw new Error('Registry unavailable');
        });

        render(
            <AppShellProvider config={config}>
                <ContextInspector />
            </AppShellProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('error').textContent).toBe('Registry unavailable');
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
    });

    it('resolves page config when a page is selected (R4)', async () => {
        DataSourceManager.register('test.pages', async () => mockPages);
        DataSourceManager.register('test.users.config', async () => ({
            title: 'User Management',
            schema: { list: 's.l', detail: 's.d' },
            dataSource: { list: 'd.l', get: 'd.g', create: 'd.c', update: 'd.u', delete: 'd.d' },
            primaryKeyField: 'id',
            accessControl: { readList: true, readDetail: true, create: true, update: true, delete: true },
        }));

        render(
            <AppShellProvider config={config}>
                <ContextInspector />
            </AppShellProvider>
        );

        // Wait for pages to load
        await waitFor(() => {
            expect(screen.getByTestId('pages-count').textContent).toBe('2');
        });

        // Click to select the "users" page
        fireEvent.click(screen.getByTestId('select-users'));

        await waitFor(() => {
            expect(screen.getByTestId('active-page').textContent).toBe('users');
            expect(screen.getByTestId('active-config').textContent).toBe('User Management');
        });
    });

    it('updates the URL hash when a page is selected', async () => {
        DataSourceManager.register('test.pages', async () => mockPages);
        DataSourceManager.register('test.users.config', async () => ({
            title: 'User Management',
            schema: { list: 's.l', detail: 's.d' },
            dataSource: { list: 'd.l', get: 'd.g', create: 'd.c', update: 'd.u', delete: 'd.d' },
            primaryKeyField: 'id',
            accessControl: { readList: true, readDetail: true, create: true, update: true, delete: true },
        }));

        render(
            <AppShellProvider config={config}>
                <ContextInspector />
            </AppShellProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('pages-count').textContent).toBe('2');
        });

        fireEvent.click(screen.getByTestId('select-users'));

        await waitFor(() => {
            expect(window.location.hash).toBe('#/users');
        });
    });

    it('restores page from URL hash on initial load', async () => {
        window.location.hash = '#/products';

        DataSourceManager.register('test.pages', async () => mockPages);
        DataSourceManager.register('test.products.config', async () => ({
            title: 'Product Catalog',
            schema: { list: 's.l', detail: 's.d' },
            dataSource: { list: 'd.l', get: 'd.g', create: 'd.c', update: 'd.u', delete: 'd.d' },
            primaryKeyField: 'id',
            accessControl: { readList: true, readDetail: true, create: true, update: true, delete: true },
        }));

        render(
            <AppShellProvider config={config}>
                <ContextInspector />
            </AppShellProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('active-page').textContent).toBe('products');
            expect(screen.getByTestId('active-config').textContent).toBe('Product Catalog');
        });
    });

    it('sets error when page config resolution fails (R5)', async () => {
        DataSourceManager.register('test.pages', async () => mockPages);
        DataSourceManager.register('test.users.config', async () => {
            throw new Error('Config unavailable');
        });

        render(
            <AppShellProvider config={config}>
                <ContextInspector />
            </AppShellProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('pages-count').textContent).toBe('2');
        });

        fireEvent.click(screen.getByTestId('select-users'));

        await waitFor(() => {
            expect(screen.getByTestId('error').textContent).toBe('Config unavailable');
        });
    });

    it('clears active page and URL hash when clearActivePage is called', async () => {
        DataSourceManager.register('test.pages', async () => mockPages);
        DataSourceManager.register('test.users.config', async () => ({
            title: 'User Management',
            schema: { list: 's.l', detail: 's.d' },
            dataSource: { list: 'd.l', get: 'd.g', create: 'd.c', update: 'd.u', delete: 'd.d' },
            primaryKeyField: 'id',
            accessControl: { readList: true, readDetail: true, create: true, update: true, delete: true },
        }));

        render(
            <AppShellProvider config={config}>
                <ContextInspector />
            </AppShellProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('pages-count').textContent).toBe('2');
        });

        fireEvent.click(screen.getByTestId('select-users'));

        await waitFor(() => {
            expect(screen.getByTestId('active-page').textContent).toBe('users');
            expect(window.location.hash).toBe('#/users');
        });

        fireEvent.click(screen.getByTestId('clear-active'));

        await waitFor(() => {
            expect(screen.getByTestId('active-page').textContent).toBe('none');
            expect(window.location.hash).toBe('');
        });
    });
});
