import React, { useState } from 'react';
import { ThemeProvider, PIntegRoot } from 'pinteg-react';
import { AppShellProvider } from './AppShellContext';
import { AppShellHeader } from './AppShellHeader';
import { SideNav } from './SideNav';
import { PageContent } from './PageContent';
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
export const AppShell = ({ config }: AppShellProps) => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const toggleMobileNav = () => setMobileNavOpen(prev => !prev);
    const closeMobileNav = () => setMobileNavOpen(false);

    return (
        <ThemeProvider>
            <PIntegRoot>
                <AppShellProvider config={config}>
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
                            <main className="pinteg-shell-main">
                                <PageContent />
                            </main>
                        </div>
                    </div>
                </AppShellProvider>
            </PIntegRoot>
        </ThemeProvider>
    );
};
