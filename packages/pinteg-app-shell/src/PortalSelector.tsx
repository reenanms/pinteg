import React from 'react';
import { useAppShell } from './AppShellContext';

/**
 * PortalSelector - Home view that displays available portals in a grid.
 */
export const PortalSelector = () => {
    const { portals, setActivePortal, loading, error } = useAppShell();

    if (loading && portals.length === 0) {
        return (
            <div className="pinteg-shell-loading" role="status">
                <div className="pinteg-shell-spinner" />
                <span>Loading Portals...</span>
            </div>
        );
    }

    if (error && portals.length === 0) {
        return (
            <div className="pinteg-shell-error" role="alert">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-danger)' }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h3 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--color-danger)', fontWeight: 600 }}>
                    Failed to load portals
                </h3>
                <p style={{ margin: 0, color: 'var(--color-secondary)' }}>{error}</p>
            </div>
        );
    }

    if (portals.length === 0) {
        return (
            <div className="pinteg-shell-empty-state">
                <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: 'var(--color-text)' }}>
                    No portals available
                </h3>
                <p style={{ margin: 0, color: 'var(--color-secondary)', maxWidth: '320px', textAlign: 'center', lineHeight: 1.6 }}>
                    You don't have access to any portals.
                </p>
            </div>
        );
    }

    return (
        <div className="pinteg-shell-portal-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem',
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            {portals.map(portal => (
                <div
                    key={portal.id}
                    className="pinteg-shell-portal-card"
                    onClick={() => setActivePortal(portal.id)}
                    style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '1rem'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(0,0,0,0.15)';
                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                    }}
                >
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        background: 'var(--color-surface-alt)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: 'var(--color-primary)'
                    }}>
                        {portal.icon ? (
                            typeof portal.icon === 'string' && portal.icon.startsWith('/') ? (
                                <img src={portal.icon} alt={portal.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span>{portal.icon}</span>
                            )
                        ) : (
                            <span>{portal.title.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--color-text)' }}>
                            {portal.title}
                        </h3>
                        {portal.description && (
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-secondary)', lineHeight: 1.5 }}>
                                {portal.description}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
