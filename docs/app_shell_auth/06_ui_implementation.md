# 06. UI Implementation

## Overview
All new screens required for the authentication and authorization flows must be built utilizing the existing **PInteg** component library to maintain visual and behavioral consistency.

## Required Screens & Layouts

### 1. Login & Registration Screen
- **Components**: Standard PInteg layout forms.
- **Elements**: 
  - Email and Password input fields.
  - "Login" and "Register" toggle states.
  - "Continue with Google/Microsoft/Facebook" buttons. (If PInteg lacks specific branded OAuth buttons, standard buttons with appropriate icons should be used or a new spec created).

### 2. Portal Selection Dashboard
- **Components**: PInteg Cards or Grid layout.
- **Elements**:
  - Displays all `ACTIVE` portals the user belongs to as clickable cards.
  - Displays all `INVITED` portals in a separate section with prominent "Accept" and "Decline" PInteg buttons.

### 3. System Admin: Portal Management
- **Components**: `pinteg-crud-react` List and Detail views.
- **Elements**:
  - A standard CRUD interface listing all `Portal` records.
  - Ability to create a new portal.
  - A sub-section or related list to assign `Portal Admin` status to specific users for the selected portal.

### 4. Portal Admin: User & Group Management
This is the core administrative interface within a specific portal.

- **Users Tab**:
  - A table listing all users in the portal.
  - "Invite User" button that opens a PInteg modal/form to enter an email address.
  - Ability to select a user and assign them to multiple groups using a PInteg multi-select or checklist component.
- **Groups Tab**:
  - A CRUD interface for creating and deleting `Group` records.

### 5. Portal Admin: Page Permission Management
- **Components**: PInteg Data Table or custom Matrix layout.
- **Elements**:
  - Displays a matrix where rows are `Groups` and columns are `Pages`.
  - Clicking a cell opens a configuration form to toggle the 5 permissions (`readList`, `readDetail`, `create`, `update`, `delete`) for that specific group on that specific page.
  - Alternatively, a form where the user selects a Group, selects a Page, and toggles the checkboxes.

### 6. User Settings
- **Components**: PInteg forms and lists.
- **Elements**:
  - **Profile Details**: Update email, change password.
  - **Connected Accounts**: A list showing Google, Microsoft, and Facebook statuses. Buttons to "Connect" or "Disconnect" each provider.
  - **My Portals**: A list of active portals with a "Leave Portal" danger button. (Must use PInteg's standard destructive action confirmation flow).

## Future Enhancements
If the UI requires complex matrix views for permissions that are not currently supported by `pinteg-crud-react`, those specific components should be documented and implemented within the core library before building the shell screens.
