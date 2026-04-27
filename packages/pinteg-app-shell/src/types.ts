/**
 * Type definitions for the PInteg App Shell.
 *
 * AppShellConfig – top-level config passed to <AppShell />.
 * PageDefinition  – each entry in the page registry array.
 */

/** Top-level configuration for the App Shell. */
export interface AppShellConfig {
    /** DSM key that returns the list of registered portals */
    portalRegistry: string;
    /** Optional app title shown in the nav header */
    title?: string;
    /** Optional logo URL */
    logoUrl?: string;
}

/** A single portal entry returned by the portal-registry DSM source. */
export interface PortalDefinition {
    /** Unique identifier for the portal */
    id: string;
    /** Display name of the portal */
    title: string;
    /** Optional short description */
    description?: string;
    /** Optional icon name or URL */
    icon?: string;
    /** DSM key that returns the list of registered pages for this portal */
    pageRegistry: string;
}

/** A single page entry returned by the page-registry DSM source. */
export interface PageDefinition {
    /** Unique identifier, used to build the DSM key for page config */
    id: string;
    /** Display name shown in the nav bar */
    title: string;
    /** Optional group label for nav grouping */
    group?: string;
    /** DSM key that returns the CrudConfig for this page */
    configSource: string;
}

/** Grouped structure used internally by the SideNav. */
export interface PageGroup {
    label: string;
    pages: PageDefinition[];
}
