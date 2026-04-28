# 03. System Initialization

## Overview
To prevent a "chicken-and-egg" problem where the system has no users and therefore no one can configure portals or invite other users, the application requires a bootstrapping process for the initial System Admin.

## Bootstrapping the First System Admin

### Configuration-Driven Initialization
The very first system admin is created automatically during the application's startup phase based on environment variables or configuration files.

1. **Environment Variables**:
   - `DEFAULT_ADMIN_EMAIL`: The email address for the initial system admin.
   - `DEFAULT_ADMIN_PASSWORD`: The initial password.

2. **Startup Logic**:
   - On server start, the application checks if any user exists in the database with `isSystemAdmin = true`.
   - If no system admin exists, it creates a new `User` record using `DEFAULT_ADMIN_EMAIL`.
   - It hashes the `DEFAULT_ADMIN_PASSWORD` and stores it.
   - It sets `isSystemAdmin = true` for this user.
   - If a user with that email already exists but is not an admin, it promotes them to `isSystemAdmin = true`.

### First Login
- The bootstrapped user logs in using the provided email and password.
- Once logged in, they have full system access to begin creating portals and assigning Portal Admins.
- It is highly recommended that the system forces the user to change their default password upon their first successful login for security purposes.

## System Admin Capabilities
A user with `isSystemAdmin = true` bypasses all standard portal and page-level permission checks. 

- **Global Visibility**: They can see all portals within the system.
- **Global Write Access**: They can create, update, and delete portals.
- **Global User Management**: They can view all users across the system, manually assign `isPortalAdmin` status to any user for any portal, and change global access levels.
- **Permission Bypass**: When evaluating access to a specific page, if `isSystemAdmin` is true, the authorization engine immediately returns `true` for all `readList`, `readDetail`, `create`, `update`, and `delete` checks, ignoring group memberships entirely.
