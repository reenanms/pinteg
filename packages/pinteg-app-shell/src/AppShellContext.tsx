import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { DataSourceManager } from 'pinteg-data-source';
import { CrudConfig } from 'pinteg-crud-react';
import { AppShellConfig, PageDefinition } from './types';

export interface AppShellContextType {
    config: AppShellConfig;
    pages: PageDefinition[];
    activePage: PageDefinition | null;
    activePageConfig: CrudConfig | null;
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

/** Reads the page id from the URL hash (e.g. "#/users" → "users"). */
function getPageIdFromHash(): string {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    // Supports "#/pageId" and "#pageId"
    return hash.replace(/^#\/?/, '');
}

/** Writes the page id into the URL hash without triggering a navigation. */
function setHashForPage(pageId: string): void {
    if (typeof window === 'undefined') return;
    const target = `#/${pageId}`;
    if (window.location.hash !== target) {
        window.history.replaceState(null, '', target);
    }
}

/** Clears the hash from the URL. */
function clearHash(): void {
    if (typeof window === 'undefined') return;
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

export const AppShellProvider = ({ config, children }: AppShellProviderProps) => {
    const [pages, setPages] = useState<PageDefinition[]>([]);
    const [activePage, setActivePageDef] = useState<PageDefinition | null>(null);
    const [activePageConfig, setActivePageConfig] = useState<CrudConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const pagesRef = useRef<PageDefinition[]>([]);

    // Keep a ref in sync so the hashchange listener can access current pages
    useEffect(() => { pagesRef.current = pages; }, [pages]);

    // R4 – Resolve page CrudConfig and update URL hash
    const setActivePage = useCallback((pageId: string) => {
        const currentPages = pagesRef.current;
        const page = currentPages.find(p => p.id === pageId);
        if (!page) return;

        setActivePageDef(page);
        setActivePageConfig(null);
        setLoading(true);
        setError('');
        setHashForPage(pageId);

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

    // Navigate back to home (deselect page)
    const clearActivePage = useCallback(() => {
        setActivePageDef(null);
        setActivePageConfig(null);
        setError('');
        setLoading(false);
        clearHash();
    }, []);

    // R1 – Load page registry from DSM, then restore from hash
    useEffect(() => {
        setLoading(true);
        setError('');
        DataSourceManager.resolve<void, PageDefinition[]>(config.pageRegistry)()
            .then(result => {
                if (!Array.isArray(result)) {
                    throw new Error('Page registry must return an array of PageDefinition');
                }
                setPages(result);
                pagesRef.current = result;
                setLoading(false);

                // Restore page from URL hash on initial load
                const hashPageId = getPageIdFromHash();
                if (hashPageId) {
                    const match = result.find(p => p.id === hashPageId);
                    if (match) {
                        // Defer so React can commit the pages state first
                        setTimeout(() => setActivePage(hashPageId), 0);
                    }
                }
            })
            .catch((e: Error) => {
                setError(e.message);
                setLoading(false);
            });
    }, [config.pageRegistry, setActivePage]);

    // Listen for browser back/forward navigation via hashchange
    useEffect(() => {
        const onHashChange = () => {
            const pageId = getPageIdFromHash();
            if (pageId) {
                setActivePage(pageId);
            }
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, [setActivePage]);

    return (
        <AppShellContext.Provider value={{
            config,
            pages,
            activePage,
            activePageConfig,
            setActivePage,
            clearActivePage,
            loading,
            error,
        }}>
            {children}
        </AppShellContext.Provider>
    );
};
