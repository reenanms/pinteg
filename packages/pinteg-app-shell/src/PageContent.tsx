import React from 'react';
import { useAppShell } from './AppShellContext';
import { CrudProvider, CrudRouter } from 'pinteg-crud-react';
import { ErrorState } from './ErrorState';

/**
 * ShellBreadcrumbs – displays the navigation path within the app shell.
 *
 * Shows: App Title / Group / Page Title
 * The app title is clickable and navigates back to the home (deselects page).
 */
const ShellBreadcrumbs = () => {
    const { config, activePortal, clearActivePortal, activePage, clearActivePage } = useAppShell();

    if (!activePage || !activePortal) return null;

    const items: { label: string; clickable: boolean; action?: () => void }[] = [
        { label: config.title || 'Portals', clickable: true, action: clearActivePortal },
        { label: activePortal.title, clickable: true, action: clearActivePage },
    ];

    if (activePage.group) {
        items.push({ label: activePage.group, clickable: false });
    }

    items.push({ label: activePage.title, clickable: false });

    return (
        <nav
            className="pinteg-shell-breadcrumbs"
            style={{
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: 'var(--color-primary)',
                display: 'flex',
                gap: '8px',
            }}
        >
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <span
                        style={{
                            opacity: index === items.length - 1 ? 1 : 0.6,
                            cursor: item.clickable ? 'pointer' : 'default',
                        }}
                        onClick={item.clickable ? item.action : undefined}
                    >
                        {item.label}
                    </span>
                    {index < items.length - 1 && <span style={{ opacity: 0.6 }}>/</span>}
                </React.Fragment>
            ))}
        </nav>
    );
};

/**
 * PageContent – renders the active page's CrudProvider + CrudRouter.
 *
 * Handles loading and error states (R5) and dynamically mounts
 * the CrudProvider with the resolved CrudConfig (R4).
 *
 * Also renders navigation breadcrumbs above the CRUD content,
 * which was moved here from pinteg-crud-react to keep navigation
 * concerns inside the app shell.
 */
export const PageContent = () => {
    const { activePage, activePageConfig, loading, error, clearActivePage } = useAppShell();

    // R5 – Error state has highest priority
    if (error) {
        return <ErrorState title="Failed to load page" message={error} onHomeClick={clearActivePage} />;
    }

    // R5 – Loading state
    if (loading) {
        return (
            <div className="pinteg-shell-loading" role="status">
                <div className="pinteg-shell-spinner" />
                <span>Loading {activePage?.title || 'page'}...</span>
            </div>
        );
    }

    // No page selected yet
    if (!activePage) {
        return (
            <div className="pinteg-shell-empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 3v18M3 9h6M3 15h6" />
                </svg>
                <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: 'var(--color-text)' }}>
                    Select a page
                </h3>
                <p style={{ margin: 0, color: 'var(--color-secondary)', maxWidth: '320px', textAlign: 'center', lineHeight: 1.6 }}>
                    Choose a page from the navigation bar to get started.
                </p>
            </div>
        );
    }

    // R4 – Config not resolved yet (shouldn't reach here normally)
    if (!activePageConfig) {
        return null;
    }

    // R4 – Dynamic CrudProvider mount with the resolved config
    return (
        <div className="pinteg-shell-page-content">
            <ShellBreadcrumbs />
            <CrudProvider key={activePage.id} config={activePageConfig}>
                <CrudRouter />
            </CrudProvider>
        </div>
    );
};
