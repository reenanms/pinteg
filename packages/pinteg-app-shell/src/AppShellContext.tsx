import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { DataSourceManager } from 'pinteg-data-source';
import { CrudConfig } from 'pinteg-crud-react';
import { AppShellConfig, PageDefinition, PortalDefinition } from './types';

export interface AppShellContextType {
    config: AppShellConfig;
    portals: PortalDefinition[];
    activePortal: PortalDefinition | null;
    pages: PageDefinition[];
    activePage: PageDefinition | null;
    activePageConfig: CrudConfig | null;
    setActivePortal: (portalId: string) => void;
    clearActivePortal: () => void;
    setActivePage: (pageId: string) => void;
    clearActivePage: () => void;
    loading: boolean;
    error: string;
}

export const AppShellContext = createContext<AppShellContextType | null>(null);

export const useAppShell = (): AppShellContextType => {
    const ctx = useContext(AppShellContext);
    if (!ctx) throw new Error('useAppShell must be used within AppShellProvider');
    return ctx;
};

export interface AppShellProviderProps {
    config: AppShellConfig;
    children: React.ReactNode;
}

/** Reads the portal and page id from the URL hash (e.g. "#/portalId/pageId"). */
function getHashState(): { portalId?: string; pageId?: string } {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const cleanHash = hash.replace(/^#\/?/, '');
    if (!cleanHash) return {};
    const parts = cleanHash.split('/');
    return {
        portalId: parts[0],
        pageId: parts[1],
    };
}

/** Writes the portal/page into the URL hash without triggering a navigation. */
function setHashForState(portalId?: string, pageId?: string): void {
    if (typeof window === 'undefined') return;
    let target = '';
    if (portalId) {
        target = `#/${portalId}`;
        if (pageId) {
            target += `/${pageId}`;
        }
    }
    if (window.location.hash !== target) {
        window.history.replaceState(null, '', target || window.location.pathname + window.location.search);
    }
}

/** Clears the hash from the URL. */
function clearHash(): void {
    if (typeof window === 'undefined') return;
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

export const AppShellProvider = ({ config, children }: AppShellProviderProps) => {
    const [portals, setPortals] = useState<PortalDefinition[]>([]);
    const [activePortal, setActivePortalDef] = useState<PortalDefinition | null>(null);
    const [pages, setPages] = useState<PageDefinition[]>([]);
    const [activePage, setActivePageDef] = useState<PageDefinition | null>(null);
    const [activePageConfig, setActivePageConfig] = useState<CrudConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const portalsRef = useRef<PortalDefinition[]>([]);
    const pagesRef = useRef<PageDefinition[]>([]);
    const activePortalRef = useRef<PortalDefinition | null>(null);

    useEffect(() => { portalsRef.current = portals; }, [portals]);
    useEffect(() => { pagesRef.current = pages; }, [pages]);
    useEffect(() => { activePortalRef.current = activePortal; }, [activePortal]);

    const setActivePage = useCallback((pageId: string) => {
        const currentPages = pagesRef.current;
        const page = currentPages.find(p => p.id === pageId);
        if (!page) return;

        setActivePageDef(page);
        setActivePageConfig(null);
        setLoading(true);
        setError('');
        
        // Update hash using current portal ref
        const portalId = activePortalRef.current?.id;
        setHashForState(portalId, pageId);

        DataSourceManager.resolve<void, CrudConfig>(page.configSource)()
            .then(cfg => {
                setActivePageConfig(cfg);
                setLoading(false);
            })
            .catch((e: Error) => {
                setError(e.message);
                setLoading(false);
            });
    }, []);

    const clearActivePage = useCallback(() => {
        setActivePageDef(null);
        setActivePageConfig(null);
        setError('');
        setLoading(false);
        const portalId = activePortalRef.current?.id;
        if (portalId) {
            setHashForState(portalId);
        } else {
            clearHash();
        }
    }, []);

    const setActivePortal = useCallback((portalId: string) => {
        const currentPortals = portalsRef.current;
        const portal = currentPortals.find(p => p.id === portalId);
        if (!portal) return;

        setActivePortalDef(portal);
        setPages([]); // Clear previous pages
        clearActivePage(); // Clear active page and config
        setLoading(true);
        setError('');
        setHashForState(portalId);

        // Fetch pages for this portal
        DataSourceManager.resolve<void, PageDefinition[]>(portal.pageRegistry)()
            .then(result => {
                if (!Array.isArray(result)) {
                    throw new Error('Page registry must return an array of PageDefinition');
                }
                setPages(result);
                setLoading(false);
            })
            .catch((e: Error) => {
                setError(e.message);
                setLoading(false);
            });
    }, [clearActivePage]);

    const clearActivePortal = useCallback(() => {
        setActivePortalDef(null);
        setPages([]);
        clearActivePage();
        clearHash();
    }, [clearActivePage]);

    // R1 – Load portal registry from DSM, then restore from hash
    useEffect(() => {
        setLoading(true);
        setError('');
        DataSourceManager.resolve<void, PortalDefinition[]>(config.portalRegistry)()
            .then(result => {
                if (!Array.isArray(result)) {
                    throw new Error('Portal registry must return an array of PortalDefinition');
                }
                setPortals(result);
                portalsRef.current = result;
                setLoading(false);

                // Restore state from URL hash on initial load
                const hashState = getHashState();
                if (hashState.portalId) {
                    const match = result.find(p => p.id === hashState.portalId);
                    if (match) {
                        setTimeout(() => {
                            setActivePortal(hashState.portalId!);
                            
                            // If a page is also specified, we need to wait for the pages to load first
                            // but since setActivePortal is async (fetches pages), we need to chain it.
                            // To keep it simple, the hash change listener below will catch the initial load
                            // if we trigger a dummy event or handle it in a separate effect.
                            // Let's just rely on the hash change listener for deep linking.
                        }, 0);
                    }
                }
            })
            .catch((e: Error) => {
                setError(e.message);
                setLoading(false);
            });
    }, [config.portalRegistry, setActivePortal]);

    // Listen for browser back/forward navigation via hashchange
    useEffect(() => {
        const onHashChange = () => {
            const { portalId, pageId } = getHashState();
            
            // Handle Portal Selection
            const currentPortal = portalsRef.current.find(p => p.id === portalId);
            if (portalId && currentPortal) {
                // If portal changed, set it.
                if (activePortal?.id !== portalId) {
                     setActivePortal(portalId);
                     // Note: Deep linking to page right after portal switch is tricky here because pages aren't loaded yet.
                     // A robust solution handles this inside the portal pages fetch.
                } else if (pageId && activePage?.id !== pageId) {
                    setActivePage(pageId);
                } else if (!pageId && activePage) {
                    clearActivePage();
                }
            } else if (!portalId && activePortal) {
                clearActivePortal();
            }
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, [activePortal, activePage, setActivePortal, setActivePage, clearActivePage, clearActivePortal]);

    return (
        <AppShellContext.Provider value={{
            config,
            portals,
            activePortal,
            pages,
            activePage,
            activePageConfig,
            setActivePortal,
            clearActivePortal,
            setActivePage,
            clearActivePage,
            loading,
            error,
        }}>
            {children}
        </AppShellContext.Provider>
    );
};
