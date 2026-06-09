# User Profile and Security Settings Design Spec

This document details the architecture, UX, and endpoints for implementing a professional-grade user profile and security page inside the TracerPro platform.

---

## 1. Goal

Implement a comprehensive, premium-grade profile management dashboard at `/dashboard/profile` where users can:
- Update profile details (Name, Email).
- Update their password securely.
- Setup and manage Two-Factor Authentication (2FA) with TOTP.
- View active sessions (tokens) with device information and revoke them individually or in bulk.
- Securely delete their account.

---

## 2. UX & UI Layout

The UI will be built at [app/dashboard/profile/page.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/app/dashboard/profile/page.tsx) with a high-fidelity dashboard feel using vanilla CSS, Tailwind, and Shadcn/ui components:

- **Header / Hero Card**: A modern card showing user avatar (initials-based fallback), Name, Email, Role badge, and account creation date.
- **Section Tabs**: Tabbed navigation (using `<Tabs>`) to separate concerns:
  - **General Settings**: Profile name and email editing.
  - **Security Settings**: Password change & Two-Factor Authentication (2FA).
  - **Sessions & Devices**: Active sessions table with device information and revoke actions.
  - **Danger Zone**: A dedicated area for account deletion.

---

## 3. Frontend Architecture

### Server Actions
We will create a new Server Actions file [actions/profile.actions.ts](file:///Users/mbp/Desktop/Code/tracerpro-new/actions/profile.actions.ts):
- `updateProfile(formData)` -> calling `PATCH /api/user/profile`
- `updatePassword(formData)` -> calling `PUT /api/user/password`
- `enableTwoFactor()` -> calling `POST /api/user/two-factor`
- `confirmTwoFactor(code)` -> calling `POST /api/user/two-factor/confirm`
- `disableTwoFactor(password)` -> calling `DELETE /api/user/two-factor`
- `getUserSessions()` -> calling `GET /api/tokens`
- `revokeSession(tokenId)` -> calling `DELETE /api/tokens/${tokenId}`
- `revokeAllOtherSessions()` -> calling `DELETE /api/tokens`
- `deleteAccount(password)` -> calling `DELETE /api/user`

---

## 4. Backend Architecture (Laravel)

### Dependency changes
- **BaconQrCode**: Install `bacon/bacon-qr-code` to generate clean, native SVG QR code strings for the frontend.
- **Google2FA**: Install `pragmarx/google2fa` for standard TOTP secret generation, URL formatting, and code verification.

### Database migration
- Add `two_factor_secret`, `two_factor_recovery_codes`, and `two_factor_confirmed_at` to the `users` table.

### API Routes & Controllers
- Update `routes/api.php` with:
  ```php
  Route::patch('/user/profile', [AuthController::class, 'updateProfile']);
  Route::put('/user/password', [AuthController::class, 'updatePassword']);
  Route::post('/user/two-factor', [AuthController::class, 'enableTwoFactor']);
  Route::post('/user/two-factor/confirm', [AuthController::class, 'confirmTwoFactor']);
  Route::delete('/user/two-factor', [AuthController::class, 'disableTwoFactor']);
  Route::delete('/tokens', [AuthController::class, 'revokeOtherTokens']);
  Route::delete('/user', [AuthController::class, 'deleteAccount']);
  ```
- Implement the corresponding business logic in `AuthController.php`.

---

## 5. Verification Plan

### Automated Tests
- Test cases verifying password validation, 2FA code verification, and session token deletion.

### Manual Verification
- Verify name/email update propagates to sidebar instantly.
- Verify 2FA enrollment flow works with Google Authenticator.
- Verify logging out other devices invalidates corresponding bearer tokens.
- Verify deleting account redirect works and invalidates user session.
