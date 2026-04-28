# 00. Overview: PInteg App Shell Authentication & Authorization

## Motivation

As the `pinteg-app-shell` grows into a multi-portal environment, it requires a robust authentication and authorization layer. This specification outlines the security model, detailing how users authenticate via third-party providers, and how access control is managed at the system, portal, and page levels.

Due to the complexity of the implementation, this specification has been broken down into several detailed documents following a logical implementation sequence.

## Detailed Specifications

Please refer to the following documents located in this directory for detailed implementation guidelines:

1. [Data Model](./01_data_model.md) - The underlying schema required before any logic can be written.
2. [Core Authentication](./02_core_authentication.md) - How users verify their identity (Email/Password, OAuth) and link accounts.
3. [System Initialization](./03_system_initialization.md) - Bootstrapping the first System Admin and defining global bypass capabilities.
4. [Portal & Invite Flow](./04_portal_and_invite_flow.md) - Managing portals and onboarding users via internal invitations.
5. [Authorization Engine](./05_authorization_engine.md) - The core logic for additive, group-based permission evaluation.
6. [UI Implementation](./06_ui_implementation.md) - Frontend screens using PInteg components.

---

## Requirements Traceability

| # | Requirement |
|---|-------------|
| R1 | Authentication supports Email/Password, plus Google, Microsoft, and Facebook logins with connect/disconnect functionality. |
| R2 | Authorization grants or denies a user access to a specific portal. |
| R3 | System Admins have unrestricted access and can change any user's access globally. |
| R4 | Portal Admins can invite users, create groups, assign users to groups, and manage page permissions exclusively via groups. |
| R5 | Users can automatically remove themselves from a portal. |
| R6 | Page-level permissions (`readList`, `readDetail`, `create`, `update`, `delete`) are assigned to groups, and users additively inherit them. |
| R7 | All management and authentication screens are built using PInteg components. |

---

## Effort Estimate

| Requirement | Points |
|-------------|--------|
| R1 – Authentication Integrations (Google, MS, FB) | 8 |
| R2 – Portal Access Control Logic | 5 |
| R3 – System Admin Role & Management Screen | 5 |
| R4 – Portal Admin User & Group Management Screens | 8 |
| R5 – User Self-Removal Feature | 2 |
| R6 – Page-Level Granular Permissions Implementation | 8 |
| R7 – UI Implementation using PInteg | 5 |
| **Total** | **41** |
