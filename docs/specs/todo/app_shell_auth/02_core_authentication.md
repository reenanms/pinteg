# 02. Core Authentication

## Overview
The core authentication system verifies a user's identity before they can access any portals or pages within the `pinteg-app-shell`. It supports standard Email/Password combinations as well as third-party OAuth providers.

## Supported Methods

### 1. Standard Email and Password
- **Registration**: Users can register using an email and password.
- **Login**: Verifies the hashed password against the database.
- **Password Reset**: Standard flow utilizing email verification tokens.

### 2. OAuth Providers
The system integrates with:
- **Google**
- **Microsoft**
- **Facebook**

## Authentication Flow

1. **Unauthenticated State**: When an unauthenticated user navigates to the App Shell, they are redirected to the `/login` route.
2. **Login Screen**: Displays an email/password form alongside buttons for "Continue with Google", "Continue with Microsoft", and "Continue with Facebook".
3. **Execution**:
   - For **Email/Password**: The backend validates credentials and issues a secure HTTP-only session cookie or JWT.
   - For **OAuth**: The user is redirected to the provider. Upon successful authentication, the provider redirects back to the system's callback URL. The system matches the `providerUserId` to an `OAuthConnection`. If matched, a session is issued. If not, a new `User` and `OAuthConnection` are created (or linked if the user is already logged in).
4. **Authenticated State**: The user receives a session token and is redirected to the portal selection screen or their default portal.

## Linking and Unlinking Accounts
Users must have the flexibility to manage their authentication methods post-registration.

- **Connecting Accounts**: From the "User Settings" screen, an authenticated user can choose to connect a new provider. The system initiates the standard OAuth flow, but upon callback, instead of logging the user in, it creates a new `OAuthConnection` record linked to the user's existing `id`.
- **Disconnecting Accounts**: Users can remove an `OAuthConnection` from their profile, provided they have at least one other valid authentication method remaining (e.g., they cannot disconnect Google if they don't have a password set or another OAuth provider linked).

## Session Management
- Sessions should be managed via secure, HttpOnly cookies to prevent XSS attacks.
- Tokens should have a reasonable expiration time with a refresh token mechanism if long-lived sessions are required.
- Logging out invalidates the current session token both on the client and the server.
