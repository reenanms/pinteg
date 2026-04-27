import React from 'react';
import { useTheme } from 'pinteg-react';
import { useAppShell } from './AppShellContext';

export interface AppShellHeaderProps {
    /** Whether the mobile nav is currently open */
    mobileNavOpen?: boolean;
    /** Toggle mobile nav state */
    onToggleMobileNav?: () => void;
}

/**
 * AppShellHeader – top bar with hamburger (mobile), logo, title, and theme selector.
 */
export const AppShellHeader = ({ mobileNavOpen, onToggleMobileNav }: AppShellHeaderProps) => {
    const { config, activePortal, clearActivePortal, clearActivePage } = useAppShell();
    const { themeId, setTheme, availableThemes } = useTheme();

    return (
        <header className="pinteg-shell-header">
            <div className="pinteg-shell-header-left">
                {/* Hamburger – visible only on mobile via CSS */}
                {onToggleMobileNav && (
                    <button
                        className="pinteg-shell-hamburger"
                        onClick={onToggleMobileNav}
                        aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
                        title={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
                    >
                        <span className="pinteg-shell-hamburger-line" />
                        <span className="pinteg-shell-hamburger-line" />
                        <span className="pinteg-shell-hamburger-line" />
                    </button>
                )}
                <div 
                    className="pinteg-shell-header-brand" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <div 
                        onClick={clearActivePortal}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                        title="Voltar para a lista de portais"
                    >
                        {config.logoUrl && (
                            <img
                                src={config.logoUrl}
                                alt={config.title || 'Logo'}
                                className="pinteg-shell-logo"
                            />
                        )}
                        <h1 className="pinteg-shell-title" style={{ margin: 0 }}>
                            {config.title || 'PInteg Gateway'}
                        </h1>
                    </div>
                    {activePortal && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--color-text-secondary, #666)', fontSize: '18px', fontWeight: 300 }}>/</span>
                            <h1 
                                className="pinteg-shell-title" 
                                style={{ margin: 0, cursor: 'pointer', color: 'var(--color-primary, #007bff)' }}
                                onClick={clearActivePage}
                                title={`Ir para a página inicial do portal ${activePortal.title}`}
                            >
                                {activePortal.title}
                            </h1>
                        </div>
                    )}
                </div>
            </div>
            <div className="pinteg-shell-header-right">
                <select
                    value={themeId}
                    onChange={e => setTheme(e.target.value)}
                    className="pinteg-shell-theme-select"
                    aria-label="Select theme"
                >
                    {availableThemes.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>
        </header>
    );
};
