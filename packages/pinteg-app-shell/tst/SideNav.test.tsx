import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { DataSourceManager } from 'pinteg-data-source';
import { AppShellProvider } from '../src/AppShellContext';
import { SideNav } from '../src/SideNav';
import { AppShellConfig, PageDefinition } from '../src/types';

const mockPages: PageDefinition[] = [
    { id: 'users', title: 'Users', group: 'Administration', configSource: 'nav.users.config' },
    { id: 'roles', title: 'Roles', group: 'Administration', configSource: 'nav.roles.config' },
    { id: 'products', title: 'Products', group: 'Catalog', configSource: 'nav.products.config' },
    { id: 'orders', title: 'Orders', group: 'Catalog', configSource: 'nav.orders.config' },
    { id: 'dashboard', title: 'Dashboard', configSource: 'nav.dashboard.config' },
];

const config: AppShellConfig = {
    pageRegistry: 'nav.test.pages',
    title: 'Nav Test',
};

const renderWithShell = (ui: React.ReactNode) => {
    return render(
        <AppShellProvider config={config}>
            {ui}
        </AppShellProvider>
    );
};

describe('SideNav', () => {
    beforeEach(() => {
        DataSourceManager._sources.clear();
        window.location.hash = '';
        DataSourceManager.register('nav.test.pages', async () => mockPages);
    });

    it('renders grouped pages with group labels (R2)', async () => {
        renderWithShell(<SideNav />);

        await waitFor(() => {
            expect(screen.getByText('Administration')).toBeDefined();
            expect(screen.getByText('Catalog')).toBeDefined();
            expect(screen.getByText('General')).toBeDefined();
        });

        // Check page buttons exist
        expect(screen.getByTitle('Users')).toBeDefined();
        expect(screen.getByTitle('Roles')).toBeDefined();
        expect(screen.getByTitle('Products')).toBeDefined();
        expect(screen.getByTitle('Orders')).toBeDefined();
        expect(screen.getByTitle('Dashboard')).toBeDefined();
    });

    it('filters pages by search query (R3)', async () => {
        renderWithShell(<SideNav />);

        await waitFor(() => {
            expect(screen.getByTitle('Users')).toBeDefined();
        });

        const searchInput = screen.getByPlaceholderText('Search pages...');
        fireEvent.change(searchInput, { target: { value: 'user' } });

        // Only "Users" should remain visible
        expect(screen.getByTitle('Users')).toBeDefined();
        expect(screen.queryByTitle('Products')).toBeNull();
        expect(screen.queryByTitle('Orders')).toBeNull();
        expect(screen.queryByTitle('Dashboard')).toBeNull();
    });

    it('shows empty message when search matches nothing', async () => {
        renderWithShell(<SideNav />);

        await waitFor(() => {
            expect(screen.getByTitle('Users')).toBeDefined();
        });

        const searchInput = screen.getByPlaceholderText('Search pages...');
        fireEvent.change(searchInput, { target: { value: 'zzzznotfound' } });

        expect(screen.getByText('No pages match your search.')).toBeDefined();
    });

    it('renders backdrop when mobileOpen is true (R6)', async () => {
        renderWithShell(<SideNav mobileOpen={true} onClose={() => {}} />);

        await waitFor(() => {
            expect(screen.getByTitle('Users')).toBeDefined();
        });

        expect(screen.getByTestId('shell-backdrop')).toBeDefined();
    });

    it('does not render backdrop when mobileOpen is false', async () => {
        renderWithShell(<SideNav mobileOpen={false} />);

        await waitFor(() => {
            expect(screen.getByTitle('Users')).toBeDefined();
        });

        expect(screen.queryByTestId('shell-backdrop')).toBeNull();
    });
});
