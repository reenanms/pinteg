# 04. Portal and Invite Flow

## Overview
A "Portal" is the primary organizational unit in the App Shell. Users belong to portals, and all permissions are scoped within a portal. This document outlines how portals are created, how users are invited, and how they manage their membership.

## Portal Creation
1. **Action**: A System Admin navigates to the "Portal Management" screen.
2. **Details**: They create a new portal by providing a Name and Description.
3. **Delegation**: The System Admin then adds a user to the portal and explicitly flags them with `isPortalAdmin = true`. From this point on, the Portal Admin can manage the portal independently.

## Invite Flow
Users do not receive email magic links for portal access in the current implementation. Instead, invites are handled internally within the App Shell interface.

1. **Issuing an Invite**:
   - A Portal Admin navigates to the "User Management" screen within their portal.
   - They click "Invite User" and enter an email address.
   - If a `User` with that email does not exist in the system, a placeholder `User` record is created (with no password or OAuth connections).
   - A `PortalUser` record is created linking the user to the portal, with `status = INVITED`.

2. **Accepting an Invite**:
   - The invited user logs into the App Shell (either via OAuth or by registering with the invited email and a new password).
   - Upon logging in, the user sees a "Portal Selection" dashboard.
   - The dashboard queries the `PortalUser` table for all records belonging to the user.
   - Portals where `status = INVITED` are displayed with a distinct UI (e.g., an "Accept Invitation" and "Decline" button).
   - When the user clicks "Accept", the `PortalUser.status` is updated to `ACTIVE`. They can now enter the portal.
   - If they decline, the `PortalUser` record is deleted.

## Auto-Removal (Self-Service)
Users have full autonomy over their portal memberships.

1. **Action**: A user navigates to their "User Settings" or a "My Portals" management screen.
2. **Process**: They select an active portal and click "Leave Portal".
3. **Result**: The system deletes their `PortalUser` record (and by extension, removes them from all `UserGroup` associations within that portal). They immediately lose access to the portal.
4. **Exception**: A user who is the *sole* Portal Admin of a portal may be blocked from leaving until they promote another user to admin, ensuring the portal does not become orphaned.
