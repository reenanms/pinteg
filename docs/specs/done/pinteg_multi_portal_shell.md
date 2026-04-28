# Technical Specification: PInteg Multi-Portal App Shell

## 1. Overview
The current `pinteg-app-shell` is designed as a single-portal orchestrator. This specification outlines the transition to a **Multi-Portal Shell**, where the application serves as a gateway to multiple distinct "portals" (business modules, departments, or client environments), each with its own configuration, pages, and branding.

## 2. Core Concepts

### 2.1 Portal Definition
A "Portal" is a self-contained functional unit within the shell.
- **ID**: Unique identifier (used in routing).
- **Title**: Display name of the portal.
- **Description**: Brief summary (shown in the portal selection grid).
- **Icon/Logo**: Visual representation.
- **Page Registry**: A DSM key pointing to the list of pages for this specific portal.

### 2.2 Portal Registry
A global list of available portals, resolved via the **Data Source Manager (DSM)**.

## 3. Requirements

### R1: Portal Selection Home
- When no portal is active, the shell MUST display a **Portal Selection View**.
- This view displays portals as a responsive grid of "mini squares" (cards).
- Each card displays the portal's title, icon/logo, and description.
- The list of portals MUST be retrieved from a DSM source defined in the shell configuration.

### R2: Dynamic Portal Loading
- Clicking a portal card MUST set the `activePortal`.
- Upon activation, the shell MUST:
    1. Update the header title and branding.
    2. Fetch and load the page registry specific to that portal.
    3. Render the standard `SideNav` and `PageContent` flow.

### R3: Portal Switching
- Users MUST be able to return to the portal selection screen or switch portals without reloading the application.
- A "Switch Portal" action (e.g., a button in the header or clicking the logo when no page is active) must be provided.

### R4: Routing Persistence
- The URL hash MUST reflect the selection state:
    - `#/`: Home (Portal Selection).
    - `#/{portalId}`: Portal active, no page selected.
    - `#/{portalId}/{pageId}`: Portal and specific page active.
- Deep linking to a specific portal/page via URL MUST be supported.

### R5: Data Source Integration
- The shell configuration will now accept a `portalRegistry` DSM key instead of a single `pageRegistry`.
- Example Config:
  ```typescript
  const shellConfig = {
      portalRegistry: 'app.portals', // Resolves to PortalDefinition[]
  };
  ```

## 4. UI/UX Design

### 4.1 Portal Grid (Home)
- **Aesthetics**: Clean, modern grid of cards.
- **Interactions**: Hover effects on cards, clear "Enter" action.
- **Responsiveness**: Grid adjusts from 4 columns (desktop) to 1 column (mobile).

### 4.2 Header Refinement
- When a portal is active, the header title reflects the portal name.
- The logo or title acts as a link to return to the Portal Selection screen (if no page is active) or to the portal home.

## 5. Implementation Plan

### Phase 1: Types & Context
- Define `PortalDefinition` interface.
- Update `AppShellContext` to include `activePortal`.
- Modify `AppShellConfig` to use `portalRegistry`.

### Phase 2: Portal Selection View
- Implement `PortalSelector` component with a card-based grid layout.
- Fetch portal list via DSM on mount.

### Phase 3: Shell Orchestration
- Update `AppShell.tsx` to toggle between `PortalSelector` and the portal-specific layout (`SideNav` + `PageContent`).

### Phase 4: Routing Refactor
- Update hash listener and sync logic to support `{portalId}/{pageId}` structure.
- Ensure back button behavior works correctly across portal transitions.
