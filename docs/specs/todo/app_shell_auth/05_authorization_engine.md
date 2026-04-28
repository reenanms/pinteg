# 05. Authorization Engine

## Overview
The Authorization Engine is responsible for calculating exactly what a user is allowed to do on any given page within a portal. It enforces the rule that permissions are strictly group-based and additive.

## Group Management
1. **Creation**: A Portal Admin creates a `Group` (e.g., "Editors").
2. **Assignment**: The Portal Admin assigns users to this group by creating `UserGroup` records. A user can be assigned to zero, one, or multiple groups.
3. **Permissions**: The Portal Admin configures page-specific permissions for the group via the `GroupPermission` table.

## The Additive Permission Model

### Base State: Zero Trust
By default, when a user is added to a portal, they have zero permissions. If they navigate to a page, all operations (`readList`, `readDetail`, `create`, `update`, `delete`) evaluate to `false`.

### Permission Evaluation Algorithm
When the App Shell needs to determine a user's access level for a specific `pageId` within a specific `portalId`, it executes the following logic:

1. **Check System Admin**:
   - If `user.isSystemAdmin === true`, return `true` for all permissions.

2. **Check Portal Admin**:
   - If `PortalUser.isPortalAdmin === true` for this user and portal, return `true` for all permissions. (Portal Admins implicitly have full access to their own portal).

3. **Fetch User's Groups**:
   - Query all `Group` records associated with the user via `UserGroup` where `Group.portalId === currentPortalId`.

4. **Union Permissions (Additive)**:
   - For the specific `pageId`, query all `GroupPermission` records linked to the user's groups.
   - Initialize the effective permissions object: 
     `{ readList: false, readDetail: false, create: false, update: false, delete: false }`
   - Iterate through the fetched `GroupPermission` records. Perform a logical `OR` against the effective permissions.
   - Example: If Group A grants `readList`, and Group B grants `create`, the resulting effective permissions will be `{ readList: true, readDetail: false, create: true, update: false, delete: false }`.

## Enforcement in the App Shell
The evaluated permissions object must be passed down to the `pinteg-crud-react` components. The components will use these boolean flags to dynamically show/hide routes, action buttons, and edit forms.

- **Route Guards**: If `readList` is false, navigating directly to the page's list route should redirect the user to a generic "Unauthorized" or "Home" page.
- **API Security**: While the App Shell handles UI visibility, the backend API must also independently implement this exact same evaluation logic to ensure data security.
