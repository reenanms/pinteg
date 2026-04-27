import React, { useState, useMemo } from 'react';
import { useAppShell } from './AppShellContext';
import { groupPages, filterPages } from './utils';
import { PageDefinition } from './types';

export interface SideNavProps {
    /** Whether the mobile drawer is open (controlled by parent) */
    mobileOpen?: boolean;
    /** Callback to close the mobile drawer */
    onClose?: () => void;
}

/**
 * SideNav – persistent navigation bar.
 *
 * R2: Groups pages by `group` field with labelled sections.
 * R3: Real-time search filtering by title.
 * R6: Responsive – side-bar on desktop, hamburger drawer on mobile.
 */
export const SideNav = ({ mobileOpen = false, onClose }: SideNavProps) => {
    const { portals, activePortal, setActivePortal, pages, activePage, setActivePage } = useAppShell();
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => filterPages(pages, search), [pages, search]);
    const groups = useMemo(() => groupPages(filtered), [filtered]);

    const handleSelect = (page: PageDefinition) => {
        setActivePage(page.id);
        onClose?.();
    };

    return (
        <>
            {/* Backdrop for mobile overlay */}
            {mobileOpen && (
                <div
                    className="pinteg-shell-backdrop"
                    onClick={onClose}
                    data-testid="shell-backdrop"
                />
            )}

            <nav
                className={`pinteg-shell-sidenav${mobileOpen ? ' pinteg-shell-sidenav--open' : ''}`}
                role="navigation"
                aria-label="Page navigation"
            >
                {/* Search (R3) */}
                <div className="pinteg-shell-search">
                    <input
                        type="text"
                        placeholder="Search pages..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pinteg-shell-search-input"
                        aria-label="Search pages"
                    />
                    {search && (
                        <button
                            className="pinteg-shell-search-clear"
                            onClick={() => setSearch('')}
                            aria-label="Clear search"
                            title="Clear search"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>

                {/* Portals List & Grouped page list (R2) */}
                <div className="pinteg-shell-nav-list" style={{ marginTop: '16px' }}>
                    {portals.map(portal => {
                        const isPortalActive = activePortal?.id === portal.id;
                        return (
                            <div key={portal.id} className="pinteg-shell-portal-section" style={{ marginBottom: '8px' }}>
                                <button
                                    className={`pinteg-shell-nav-item${isPortalActive ? ' pinteg-shell-nav-item--active' : ''}`}
                                    onClick={() => setActivePortal(portal.id)}
                                    title={portal.title}
                                    style={{ fontWeight: isPortalActive ? 600 : 500, display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    {portal.icon && <span>{portal.icon}</span>}
                                    {portal.title}
                                </button>
                                
                                {/* Only load/show pages menu when this portal is active */}
                                {isPortalActive && (
                                    <div className="pinteg-shell-portal-pages" style={{ paddingLeft: '16px', marginTop: '8px' }}>
                                        {groups.length === 0 && (
                                            <div className="pinteg-shell-nav-empty">
                                                No pages match your search.
                                            </div>
                                        )}
                                        {groups.map(group => (
                                            <div key={group.label} className="pinteg-shell-nav-group">
                                                <div className="pinteg-shell-nav-group-label">{group.label}</div>
                                                {group.pages.map(page => {
                                                    const isActive = activePage?.id === page.id;
                                                    return (
                                                        <button
                                                            key={page.id}
                                                            className={`pinteg-shell-nav-item${isActive ? ' pinteg-shell-nav-item--active' : ''}`}
                                                            onClick={() => handleSelect(page)}
                                                            title={page.title}
                                                        >
                                                            {page.title}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};
