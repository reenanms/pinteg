# 01. Data Model

## Overview
To support the PInteg App Shell's multi-portal, multi-tenant architecture with granular, group-based permissions, the underlying data model must securely associate users with portals, accounts, and groups.

## Core Entities

### 1. `User`
The central identity for a person within the system.
- `id` (UUID): Primary Key.
- `email` (String): Unique identifier, used for login.
- `passwordHash` (String): Hashed password for standard authentication (can be null if only OAuth is used, but standard is supported).
- `isSystemAdmin` (Boolean): Flag indicating if the user has global system bypass privileges.

### 2. `OAuthConnection`
Supports linking multiple third-party accounts (Google, Microsoft, Facebook) to a single `User`.
- `id` (UUID): Primary Key.
- `userId` (UUID): Foreign Key to `User`.
- `provider` (Enum): `GOOGLE`, `MICROSOFT`, `FACEBOOK`.
- `providerUserId` (String): The unique ID provided by the third-party service.
- `accessToken` (String): Optional, depending on if offline access is needed.

### 3. `Portal`
A distinct workspace or tenant within the application.
- `id` (UUID): Primary Key.
- `name` (String): Display name of the portal.
- `description` (String): Optional description.

### 4. `PortalUser`
Represents a user's membership within a specific portal, including pending invites.
- `id` (UUID): Primary Key.
- `portalId` (UUID): Foreign Key to `Portal`.
- `userId` (UUID): Foreign Key to `User`.
- `isPortalAdmin` (Boolean): Flag indicating if the user has administrative rights over this specific portal.
- `status` (Enum): `INVITED`, `ACTIVE`. (Used to display pending invites to the user).

### 5. `Group`
Groups are scoped entirely to a specific portal. They act as the sole container for permissions.
- `id` (UUID): Primary Key.
- `portalId` (UUID): Foreign Key to `Portal`.
- `name` (String): Name of the group (e.g., "Content Editors", "Viewers").

### 6. `UserGroup` (Many-to-Many)
Associates a `User` with a `Group`.
- `userId` (UUID): Foreign Key to `User`.
- `groupId` (UUID): Foreign Key to `Group`.

### 7. `GroupPermission`
Defines what a specific group is allowed to do on a specific page within the portal.
- `id` (UUID): Primary Key.
- `groupId` (UUID): Foreign Key to `Group`.
- `pageId` (String): The string identifier of the page (matches the App Shell Page Registry ID).
- `readList` (Boolean)
- `readDetail` (Boolean)
- `create` (Boolean)
- `update` (Boolean)
- `delete` (Boolean)

## Additive Permission Logic (Data Level)
Since users cannot have direct permissions, the system must query `GroupPermission` for all groups the user belongs to within the current `Portal`. If *any* group grants a permission (e.g., `readList: true`), the user receives that permission.
