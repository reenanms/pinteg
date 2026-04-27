import React, { useState } from 'react';
import { ThemeProvider, PIntegRoot } from 'pinteg-react';
import { AppShellProvider } from './AppShellContext';
import { AppShellHeader } from './AppShellHeader';
import { PageContent } from './PageContent';
import { PortalSelector } from './PortalSelector';
import { SideNav } from './SideNav';
import { useAppShell } from './AppShellContext';
import { AppShellConfig } from './types';
import './app-shell.css';

export interface AppShellProps {
    config: AppShellConfig;
}

/**
 * AppShell – the top-level component that assembles the full shell.
 *
 * Provides theming via PIntegRoot, initialises the AppShellProvider
 * for page-registry resolution, and lays out the header + side-nav + content.
 */
const AppShellLayout = () => {
    const { activePortal } = useAppShell();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const toggleMobileNav = () => setMobileNavOpen(prev => !prev);
    const closeMobileNav = () => setMobileNavOpen(false);

    return (
        <div className="pinteg-shell">
            <AppShellHeader
                mobileNavOpen={mobileNavOpen}
                onToggleMobileNav={toggleMobileNav}
            />
            <div className="pinteg-shell-body">
                <SideNav
                    mobileOpen={mobileNavOpen}
                    onClose={closeMobileNav}
                />
                <main className="pinteg-shell-main" style={{ padding: activePortal ? undefined : 0 }}>
                    {activePortal ? (
                        <PageContent />
                    ) : (
                        <PortalSelector />
                    )}
                </main>
            </div>
        </div>
    );
};

export const AppShell = ({ config }: AppShellProps) => {
    return (
        <ThemeProvider>
            <PIntegRoot>
                <AppShellProvider config={config}>
                    <AppShellLayout />
                </AppShellProvider>
            </PIntegRoot>
        </ThemeProvider>
    );
};
