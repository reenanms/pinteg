import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { DataSourceManager } from 'pinteg-data-source';
import { AppShellProvider, useAppShell } from '../src/AppShellContext';
import { AppShellConfig, PageDefinition } from '../src/types';

/** Helper component that exposes context values via test IDs. */
const ContextInspector = () => {
    const { portals, pages, activePortal, activePage, activePageConfig, loading, error, setActivePortal, setActivePage, clearActivePortal, clearActivePage } = useAppShell();
    return (
        <div>
            <span data-testid="portals-count">{portals.length}</span>
            <span data-testid="pages-count">{pages.length}</span>
            <span data-testid="loading">{String(loading)}</span>
            <span data-testid="error">{error}</span>
            <span data-testid="active-portal">{activePortal?.id ?? 'none'}</span>
            <span data-testid="active-page">{activePage?.id ?? 'none'}</span>
            <span data-testid="active-config">{activePageConfig?.title ?? 'none'}</span>
            <button data-testid="clear-active-portal" onClick={clearActivePortal}>Clear Portal</button>
            <button data-testid="clear-active-page" onClick={clearActivePage}>Clear Page</button>
            {portals.map(p => (
                <button key={p.id} data-testid={`select-portal-${p.id}`} onClick={() => setActivePortal(p.id)}>
                    {p.title}
                </button>
            ))}
            {pages.map(p => (
                <button key={p.id} data-testid={`select-page-${p.id}`} onClick={() => setActivePage(p.id)}>
                    {p.title}
                </button>
            ))}
        </div>
    );
};

describe('AppShellProvider', () => {
    const mockPortals = [
        { id: 'portal1', title: 'Portal 1', pageRegistry: 'test.pages' },
    ];

    const mockPages: PageDefinition[] = [
        { id: 'users', title: 'Users', group: 'Administration', configSource: 'test.users.config' },
        { id: 'products', title: 'Products', group: 'Catalog', configSource: 'test.products.config' },
    ];

    const config: AppShellConfig = {
        portalRegistry: 'test.portals',
        title: 'Test App',
    };

    beforeEach(() => {
        // Clear previously registered sources and reset hash
        DataSourceManager._sources.clear();
        window.location.hash = '';
    });

    it('loads the portal registry from DSM (R1)', async () => {
        DataSourceManager.register('test.portals', async () => mockPortals);

        render(
            <AppShellProvider config={config}>
                <ContextInspector />
            </AppShellProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('portals-count').textContent).toBe('1');
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
    });

    it('sets error when portal registry DSM key fails (R5)', async () => {
        DataSourceManager.register('test.portals', async () => {
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
        DataSourceManager.register('test.portals', async () => mockPortals);
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
            expect(screen.getByTestId('portals-count').textContent).toBe('1');
        });

        fireEvent.click(screen.getByTestId('select-portal-portal1'));

        await waitFor(() => {
            expect(screen.getByTestId('pages-count').textContent).toBe('2');
        });

        // Click to select the "users" page
        fireEvent.click(screen.getByTestId('select-page-users'));

        await waitFor(() => {
            expect(screen.getByTestId('active-page').textContent).toBe('users');
            expect(screen.getByTestId('active-config').textContent).toBe('User Management');
        });
    });

    it('updates the URL hash when a portal and page is selected', async () => {
        DataSourceManager.register('test.portals', async () => mockPortals);
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
            expect(screen.getByTestId('portals-count').textContent).toBe('1');
        });

        fireEvent.click(screen.getByTestId('select-portal-portal1'));

        await waitFor(() => {
            expect(screen.getByTestId('pages-count').textContent).toBe('2');
            expect(window.location.hash).toBe('#/portal1');
        });

        fireEvent.click(screen.getByTestId('select-page-users'));

        await waitFor(() => {
            expect(window.location.hash).toBe('#/portal1/users');
        });
    });

    it('restores portal from URL hash on initial load', async () => {
        window.location.hash = '#/portal1';

        DataSourceManager.register('test.portals', async () => mockPortals);
        DataSourceManager.register('test.pages', async () => mockPages);

        render(
            <AppShellProvider config={config}>
                <ContextInspector />
            </AppShellProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('active-portal').textContent).toBe('portal1');
            expect(screen.getByTestId('pages-count').textContent).toBe('2');
        });
    });

    it('sets error when page config resolution fails (R5)', async () => {
        DataSourceManager.register('test.portals', async () => mockPortals);
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
            expect(screen.getByTestId('portals-count').textContent).toBe('1');
        });

        fireEvent.click(screen.getByTestId('select-portal-portal1'));

        await waitFor(() => {
            expect(screen.getByTestId('pages-count').textContent).toBe('2');
        });

        fireEvent.click(screen.getByTestId('select-page-users'));

        await waitFor(() => {
            expect(screen.getByTestId('error').textContent).toBe('Config unavailable');
        });
    });

    it('clears active page and URL hash when clearActivePage is called', async () => {
        DataSourceManager.register('test.portals', async () => mockPortals);
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
            expect(screen.getByTestId('portals-count').textContent).toBe('1');
        });

        fireEvent.click(screen.getByTestId('select-portal-portal1'));

        await waitFor(() => {
            expect(screen.getByTestId('pages-count').textContent).toBe('2');
        });

        fireEvent.click(screen.getByTestId('select-page-users'));

        await waitFor(() => {
            expect(screen.getByTestId('active-page').textContent).toBe('users');
            expect(window.location.hash).toBe('#/portal1/users');
        });

        fireEvent.click(screen.getByTestId('clear-active-page'));

        await waitFor(() => {
            expect(screen.getByTestId('active-page').textContent).toBe('none');
            expect(window.location.hash).toBe('#/portal1'); // hash restores to just portal
        });
        
        fireEvent.click(screen.getByTestId('clear-active-portal'));
        
        await waitFor(() => {
            expect(screen.getByTestId('active-portal').textContent).toBe('none');
            expect(window.location.hash).toBe('');
        });
    });
});
