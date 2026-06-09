# User Profile and Security Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a high-fidelity user profile settings page supporting inline profile details update, password change, two-factor authentication setup, active session management, and account deletion.

**Architecture:** Create server actions in the Next.js app that make calls to new and existing secure endpoints in the Laravel backend using HTTP Bearer authentication via an HttpOnly cookie. The backend leverages Sanctum for session/token listing, Google2FA for TOTP, and BaconQrCode for inline SVG rendering.

**Tech Stack:** Next.js (React 19, Tailwind CSS, Shadcn/ui), Laravel Sanctum, Google2FA, BaconQrCode.

---

### Task 1: Install Backend Packages & Create Migration

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracepro-laravel/composer.json`
- Create: `/Users/mbp/Desktop/Code/tracepro-laravel/database/migrations/2026_06_08_203528_add_two_factor_columns_to_users_table.php`

- [ ] **Step 1: Install Google2FA and BaconQrCode**
  
  Run in `/Users/mbp/Desktop/Code/tracepro-laravel`:
  ```bash
  composer require pragmarx/google2fa bacon/bacon-qr-code
  ```
  Expected: Installation finishes with no errors.

- [ ] **Step 2: Generate Migration File**
  
  Run in `/Users/mbp/Desktop/Code/tracepro-laravel`:
  ```bash
  php artisan make:migration add_two_factor_columns_to_users_table --table=users
  ```

- [ ] **Step 3: Define Migration Columns**
  
  Modify the generated migration file `/Users/mbp/Desktop/Code/tracepro-laravel/database/migrations/2026_06_08_203528_add_two_factor_columns_to_users_table.php` with:
  ```php
  <?php

  use Illuminate\Database\Migrations\Migration;
  use Illuminate\Database\Schema\Blueprint;
  use Illuminate\Support\Facades\Schema;

  return new class extends Migration
  {
      public function up(): void
      {
          Schema::table('users', function (Blueprint $table) {
              $table->text('two_factor_secret')->nullable()->after('password');
              $table->text('two_factor_recovery_codes')->nullable()->after('two_factor_secret');
              $table->timestamp('two_factor_confirmed_at')->nullable()->after('two_factor_recovery_codes');
          });
      }

      public function down(): void
      {
          Schema::table('users', function (Blueprint $table) {
              $table->dropColumn(['two_factor_secret', 'two_factor_recovery_codes', 'two_factor_confirmed_at']);
          });
      }
  };
  ```

- [ ] **Step 4: Run Migration**
  
  Run in `/Users/mbp/Desktop/Code/tracepro-laravel`:
  ```bash
  php artisan migrate
  ```
  Expected output: "Migrating: ..._add_two_factor_columns_to_users_table" followed by "Migrated".

- [ ] **Step 5: Commit changes**
  
  Run in `/Users/mbp/Desktop/Code/tracepro-laravel`:
  ```bash
  git add composer.json composer.lock database/migrations/*_add_two_factor_columns_to_users_table.php
  git commit -m "chore: add 2FA packages and users table migration"
  ```

---

### Task 2: Implement Backend API Endpoints & Routes (Profile, Password, Sessions, Deletion)

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracepro-laravel/routes/api.php`
- Modify: `/Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/AuthController.php`

- [ ] **Step 1: Declare Routes in API Routing File**
  
  Modify `/Users/mbp/Desktop/Code/tracepro-laravel/routes/api.php` by adding the profile, password, session-revocation, and account-deletion endpoints inside the `auth:sanctum` middleware block:
  ```php
  // Insert these after Route::post('/logout', [AuthController::class, 'logout']);
  Route::patch('/user/profile', [AuthController::class, 'updateProfile']);
  Route::put('/user/password', [AuthController::class, 'updatePassword']);
  Route::delete('/tokens', [AuthController::class, 'revokeOtherTokens']);
  Route::delete('/user', [AuthController::class, 'deleteAccount']);
  ```

- [ ] **Step 2: Add Controller Actions in AuthController**
  
  Modify `/Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/AuthController.php` to add the endpoint handlers:
  ```php
  // Add these methods to AuthController class
  public function updateProfile(Request $request): JsonResponse
  {
      $user = $request->user();
      $validated = $request->validate([
          'name' => 'required|string|max:255',
          'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
      ]);

      $user->update($validated);

      return response()->json([
          'message' => 'Profile updated successfully.',
          'user' => $user,
      ]);
  }

  public function updatePassword(Request $request): JsonResponse
  {
      $user = $request->user();
      $request->validate([
          'current_password' => 'required|string',
          'password' => 'required|string|min:8|confirmed',
      ]);

      if (!Hash::check($request->current_password, $user->password)) {
          throw \Illuminate\Validation\ValidationException::withMessages([
              'current_password' => ['The provided current password is incorrect.'],
          ]);
      }

      $user->update([
          'password' => Hash::make($request->password),
      ]);

      return response()->json([
          'message' => 'Password updated successfully.',
      ]);
  }

  public function revokeOtherTokens(Request $request): JsonResponse
  {
      $user = $request->user();
      $currentTokenId = $user->currentAccessToken()->id;

      $user->tokens()->where('id', '!=', $currentTokenId)->delete();

      return response()->json([
          'message' => 'All other sessions revoked successfully.',
      ]);
  }

  public function deleteAccount(Request $request): JsonResponse
  {
      $user = $request->user();
      $request->validate([
          'password' => 'required|string',
      ]);

      if (!Hash::check($request->password, $user->password)) {
          throw \Illuminate\Validation\ValidationException::withMessages([
              'password' => ['The provided password is incorrect.'],
          ]);
      }

      // Perform account deletion
      $user->tokens()->delete();
      $user->memberships()->delete();
      $user->delete();

      return response()->json([
          'message' => 'Account deleted successfully.',
      ]);
  }
  ```

- [ ] **Step 3: Test Routes**
  
  Run in `/Users/mbp/Desktop/Code/tracepro-laravel`:
  ```bash
  php artisan route:list | grep -E 'user|tokens'
  ```
  Expected output: Verify the new endpoints `/api/user/profile`, `/api/user/password`, `/api/tokens`, and `/api/user` are present.

- [ ] **Step 4: Commit changes**
  
  Run in `/Users/mbp/Desktop/Code/tracepro-laravel`:
  ```bash
  git add routes/api.php app/Http/Controllers/AuthController.php
  git commit -m "feat: add backend profile, password, session revoke and deletion actions"
  ```

---

### Task 3: Implement Backend Two-Factor Authentication (2FA) Setup

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracepro-laravel/routes/api.php`
- Modify: `/Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/AuthController.php`

- [ ] **Step 1: Declare 2FA routes in routing file**
  
  Modify `/Users/mbp/Desktop/Code/tracepro-laravel/routes/api.php` to define the 2FA enable, confirm, and disable endpoints inside the `auth:sanctum` block:
  ```php
  Route::post('/user/two-factor', [AuthController::class, 'enableTwoFactor']);
  Route::post('/user/two-factor/confirm', [AuthController::class, 'confirmTwoFactor']);
  Route::delete('/user/two-factor', [AuthController::class, 'disableTwoFactor']);
  ```

- [ ] **Step 2: Add two-factor actions in AuthController**
  
  Modify `/Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/AuthController.php` to add 2FA logic using `PragmaRX\Google2FA\Google2FA` and `BaconQrCode\Writer`:
  ```php
  // Add imports at top of file
  use PragmaRX\Google2FA\Google2FA;
  use BaconQrCode\Renderer\ImageRenderer;
  use BaconQrCode\Renderer\Image\SvgImageBackEnd;
  use BaconQrCode\Renderer\RendererStyle\RendererStyle;
  use BaconQrCode\Writer;

  // Add methods in AuthController class
  public function enableTwoFactor(Request $request): JsonResponse
  {
      $user = $request->user();

      if ($user->two_factor_confirmed_at) {
          return response()->json(['message' => 'Two-factor authentication is already enabled.'], 400);
      }

      $google2fa = new Google2FA();
      $secretKey = $google2fa->generateSecretKey();
      
      // Update temporary secret
      $user->forceFill([
          'two_factor_secret' => encrypt($secretKey),
      ])->save();

      // Generate QR Code URL and SVG
      $qrCodeUrl = $google2fa->getQRCodeUrl(
          config('app.name', 'TracerPro'),
          $user->email,
          $secretKey
      );

      $renderer = new ImageRenderer(
          new RendererStyle(200),
          new SvgImageBackEnd()
      );
      $writer = new Writer($renderer);
      $qrCodeSvg = $writer->writeString($qrCodeUrl);

      return response()->json([
          'qr_code_svg' => $qrCodeSvg,
          'secret' => $secretKey,
      ]);
  }

  public function confirmTwoFactor(Request $request): JsonResponse
  {
      $user = $request->user();
      $request->validate([
          'code' => 'required|string|size:6',
      ]);

      if (!$user->two_factor_secret) {
          return response()->json(['message' => 'Two-factor setup has not been initiated.'], 400);
      }

      $google2fa = new Google2FA();
      $secret = decrypt($user->two_factor_secret);

      $isValid = $google2fa->verifyKey($secret, $request->code);

      if (!$isValid) {
          throw \Illuminate\Validation\ValidationException::withMessages([
              'code' => ['The provided two-factor authentication code is invalid.'],
          ]);
      }

      // Generate recovery codes
      $recoveryCodes = collect(range(1, 8))->map(function () {
          return Str::random(10) . '-' . Str::random(10);
      })->toArray();

      $user->forceFill([
          'two_factor_confirmed_at' => now(),
          'two_factor_recovery_codes' => encrypt(json_encode($recoveryCodes)),
      ])->save();

      return response()->json([
          'message' => 'Two-factor authentication enabled successfully.',
          'recovery_codes' => $recoveryCodes,
      ]);
  }

  public function disableTwoFactor(Request $request): JsonResponse
  {
      $user = $request->user();
      $request->validate([
          'password' => 'required|string',
      ]);

      if (!Hash::check($request->password, $user->password)) {
          throw \Illuminate\Validation\ValidationException::withMessages([
              'password' => ['The provided password is incorrect.'],
          ]);
      }

      $user->forceFill([
          'two_factor_secret' => null,
          'two_factor_recovery_codes' => null,
          'two_factor_confirmed_at' => null,
      ])->save();

      return response()->json([
          'message' => 'Two-factor authentication disabled successfully.',
      ]);
  }
  ```

- [ ] **Step 3: Commit changes**
  
  Run in `/Users/mbp/Desktop/Code/tracepro-laravel`:
  ```bash
  git add routes/api.php app/Http/Controllers/AuthController.php
  git commit -m "feat: implement 2FA activation and verification endpoints in Laravel"
  ```

---

### Task 4: Create Frontend Server Actions

**Files:**
- Create: `/Users/mbp/Desktop/Code/tracerpro-new/actions/profile.actions.ts`

- [ ] **Step 1: Write profile.actions.ts**
  
  Create file `/Users/mbp/Desktop/Code/tracerpro-new/actions/profile.actions.ts` with Server Action implementations:
  ```typescript
  "use server";

  import api from "@/lib/api";
  import { revalidatePath } from "next/cache";

  export async function updateProfile(formData: { name: string; email: string }) {
    try {
      const response = await api.patch("/api/user/profile", formData);
      revalidatePath("/dashboard");
      return { data: response.data.user, error: null };
    } catch (error: any) {
      console.error("Error updating profile:", error);
      return { data: null, error: error.response?.data?.message || error.message };
    }
  }

  export async function updatePassword(formData: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) {
    try {
      await api.put("/api/user/password", formData);
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error updating password:", error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  export async function enableTwoFactor() {
    try {
      const response = await api.post("/api/user/two-factor");
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error("Error enabling 2FA:", error);
      return { data: null, error: error.response?.data?.message || error.message };
    }
  }

  export async function confirmTwoFactor(code: string) {
    try {
      const response = await api.post("/api/user/two-factor/confirm", { code });
      revalidatePath("/dashboard");
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error("Error confirming 2FA:", error);
      return { data: null, error: error.response?.data?.message || error.message };
    }
  }

  export async function disableTwoFactor(password: string) {
    try {
      await api.delete("/api/user/two-factor", { data: { password } });
      revalidatePath("/dashboard");
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error disabling 2FA:", error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  export async function getUserSessions() {
    try {
      const response = await api.get("/api/tokens");
      return { data: response.data.tokens, error: null };
    } catch (error: any) {
      console.error("Error fetching sessions:", error);
      return { data: null, error: error.response?.data?.message || error.message };
    }
  }

  export async function revokeSession(tokenId: string | number) {
    try {
      await api.delete(`/api/tokens/${tokenId}`);
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error revoking session:", error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  export async function revokeAllOtherSessions() {
    try {
      await api.delete("/api/tokens");
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error revoking other sessions:", error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  export async function deleteUserAccount(password: string) {
    try {
      await api.delete("/api/user", { data: { password } });
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error deleting user account:", error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }
  ```

- [ ] **Step 2: Commit changes**
  
  Run in `/Users/mbp/Desktop/Code/tracerpro-new`:
  ```bash
  git add actions/profile.actions.ts
  git commit -m "feat: add user profile, password, 2FA, and session server actions"
  ```

---

### Task 5: Implement Profile Settings Page UI

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracerpro-new/app/dashboard/profile/page.tsx`

- [ ] **Step 1: Write code for profile/page.tsx**
  
  Replace content of `/Users/mbp/Desktop/Code/tracerpro-new/app/dashboard/profile/page.tsx` with a fully featured settings interface including user details edit form, password change, active tokens management, 2FA enrollment form, and delete account confirmation dialog:
  ```tsx
  "use client";

  import React, { useState, useEffect } from "react";
  import { useAuthContext } from "@/context/auth-context";
  import {
    updateProfile,
    updatePassword,
    enableTwoFactor,
    confirmTwoFactor,
    disableTwoFactor,
    getUserSessions,
    revokeSession,
    revokeAllOtherSessions,
    deleteUserAccount,
  } from "@/actions/profile.actions";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Separator } from "@/components/ui/separator";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import { Badge } from "@/components/ui/badge";
  import { Shield, KeyRound, Monitor, AlertTriangle, CheckCircle, RefreshCw, Trash2, ShieldAlert } from "lucide-react";
  import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
  } from "@/components/ui/alert-dialog";

  interface UserSession {
    id: number;
    name: string;
    created_at: string;
    last_used_at: string | null;
  }

  export default function ProfilePage() {
    const { user: rawUser, refreshUser, logout } = useAuthContext();
    const [activeTab, setActiveTab] = useState("general");

    // Profile Details Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Sessions State
    const [sessions, setSessions] = useState<UserSession[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);

    // 2FA State
    const [twoFactorLoading, setTwoFactorLoading] = useState(false);
    const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
    const [totpSecret, setTotpSecret] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [twoFactorMsg, setTwoFactorMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [disable2faPassword, setDisable2faPassword] = useState("");
    const [showDisable2faDialog, setShowDisable2faDialog] = useState(false);

    // Delete Account State
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
      if (rawUser) {
        setName(rawUser.name || "");
        setEmail(rawUser.email || "");
      }
    }, [rawUser]);

    useEffect(() => {
      if (activeTab === "sessions") {
        fetchSessions();
      }
    }, [activeTab]);

    const fetchSessions = async () => {
      setSessionsLoading(true);
      const res = await getUserSessions();
      if (res.data) {
        setSessions(res.data);
      }
      setSessionsLoading(false);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      setProfileLoading(true);
      setProfileMsg(null);
      const res = await updateProfile({ name, email });
      if (res.error) {
        setProfileMsg({ type: "error", text: res.error });
      } else {
        setProfileMsg({ type: "success", text: "Profile details updated successfully." });
        await refreshUser();
      }
      setProfileLoading(false);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmNewPassword) {
        setPasswordMsg({ type: "error", text: "Passwords do not match." });
        return;
      }
      setPasswordLoading(true);
      setPasswordMsg(null);
      const res = await updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmNewPassword,
      });
      if (res.error) {
        setPasswordMsg({ type: "error", text: res.error });
      } else {
        setPasswordMsg({ type: "success", text: "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
      setPasswordLoading(false);
    };

    const handleInitiate2FA = async () => {
      setTwoFactorLoading(true);
      setTwoFactorMsg(null);
      const res = await enableTwoFactor();
      if (res.error) {
        setTwoFactorMsg({ type: "error", text: res.error });
      } else if (res.data) {
        setQrCodeSvg(res.data.qr_code_svg);
        setTotpSecret(res.data.secret);
      }
      setTwoFactorLoading(false);
    };

    const handleConfirm2FA = async (e: React.FormEvent) => {
      e.preventDefault();
      setTwoFactorLoading(true);
      setTwoFactorMsg(null);
      const res = await confirmTwoFactor(verificationCode);
      if (res.error) {
        setTwoFactorMsg({ type: "error", text: res.error });
      } else if (res.data) {
        setTwoFactorMsg({ type: "success", text: "Two-Factor authentication configured successfully." });
        setRecoveryCodes(res.data.recovery_codes || []);
        setQrCodeSvg(null);
        setTotpSecret(null);
        setVerificationCode("");
        await refreshUser();
      }
      setTwoFactorLoading(false);
    };

    const handleDisable2FA = async () => {
      setTwoFactorLoading(true);
      setTwoFactorMsg(null);
      const res = await disableTwoFactor(disable2faPassword);
      if (res.error) {
        setTwoFactorMsg({ type: "error", text: res.error });
      } else {
        setTwoFactorMsg({ type: "success", text: "Two-factor authentication disabled successfully." });
        setShowDisable2faDialog(false);
        setDisable2faPassword("");
        await refreshUser();
      }
      setTwoFactorLoading(false);
    };

    const handleRevokeSession = async (id: number) => {
      const res = await revokeSession(id);
      if (res.success) {
        fetchSessions();
      }
    };

    const handleRevokeAllOthers = async () => {
      const res = await revokeAllOtherSessions();
      if (res.success) {
        fetchSessions();
      }
    };

    const handleDeleteAccount = async () => {
      if (deleteConfirmText !== "DELETE") {
        setDeleteError("Confirmation text must be 'DELETE'.");
        return;
      }
      setDeleteLoading(true);
      setDeleteError(null);
      const res = await deleteUserAccount(deletePassword);
      if (res.error) {
        setDeleteError(res.error);
        setDeleteLoading(false);
      } else {
        logout();
      }
    };

    if (!rawUser) {
      return (
        <div className="flex h-96 items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    const initials = rawUser.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";
    const is2faActive = !!rawUser.two_factor_confirmed_at;

    return (
      <div className="container max-w-6xl py-8 px-4 space-y-8">
        {/* Profile Header Block */}
        <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-gradient-to-r from-violet-600/10 via-indigo-600/5 to-transparent border border-muted items-center md:items-start text-center md:text-left shadow-sm">
          <Avatar className="h-20 w-20 border-2 border-violet-600">
            <AvatarFallback className="bg-violet-600/20 text-violet-700 text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 flex-1">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{rawUser.name}</h1>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-700 hover:bg-indigo-500/10">
                  {rawUser.organizations?.[0]?.pivot?.role || "Member"}
                </Badge>
                {is2faActive && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 flex gap-1 items-center">
                    <Shield className="h-3 w-3" /> 2FA Active
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{rawUser.email}</p>
            <p className="text-xs text-muted-foreground/80">
              Account created on {new Date(rawUser.created_at).toLocaleDateString(undefined, { dateStyle: "long" })}
            </p>
          </div>
        </div>

        {/* Setting Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="general" className="rounded-lg">General</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg">Security</TabsTrigger>
            <TabsTrigger value="sessions" className="rounded-lg">Sessions</TabsTrigger>
            <TabsTrigger value="danger" className="rounded-lg text-red-500 focus:text-red-500">Danger Zone</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general">
            <Card className="border border-muted shadow-sm">
              <form onSubmit={handleUpdateProfile}>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Update your personal information and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileMsg && (
                    <div className={`p-4 rounded-lg flex items-center gap-2 border text-sm ${
                      profileMsg.type === "success" 
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" 
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}>
                      {profileMsg.type === "success" ? <CheckCircle className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                      {profileMsg.text}
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="max-w-md"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profile-email">Email Address</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="max-w-md"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={profileLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {profileLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Password Change Card */}
            <Card className="border border-muted shadow-sm">
              <form onSubmit={handleUpdatePassword}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-indigo-600" />
                    Change Password
                  </CardTitle>
                  <CardDescription>Secure your account with a strong password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {passwordMsg && (
                    <div className={`p-4 rounded-lg flex items-center gap-2 border text-sm ${
                      passwordMsg.type === "success" 
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" 
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}>
                      {passwordMsg.type === "success" ? <CheckCircle className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                      {passwordMsg.text}
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="max-w-md"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="max-w-md"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      className="max-w-md"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={passwordLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {passwordLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Two Factor Card */}
            <Card className="border border-muted shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Add an extra layer of security to your account using TOTP.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {twoFactorMsg && (
                  <div className={`p-4 rounded-lg flex items-center gap-2 border text-sm ${
                    twoFactorMsg.type === "success" 
                      ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" 
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}>
                    {twoFactorMsg.type === "success" ? <CheckCircle className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                    {twoFactorMsg.text}
                  </div>
                )}

                {recoveryCodes.length > 0 && (
                  <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                    <h4 className="font-semibold text-indigo-900 text-sm flex gap-1 items-center">
                      <AlertTriangle className="h-4 w-4" /> Save these backup recovery codes:
                    </h4>
                    <p className="text-xs text-indigo-700">If you lose access to your device, you can use these codes to sign in. Store them safely.</p>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {recoveryCodes.map((code) => (
                        <code key={code} className="text-xs font-mono bg-background p-1.5 border rounded text-center select-all">{code}</code>
                      ))}
                    </div>
                  </div>
                )}

                {is2faActive ? (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-emerald-950 flex gap-2 items-center">
                        <CheckCircle className="h-5 w-5 text-emerald-600" /> Two-factor authentication is active.
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">Your account is secured using a standard authenticator app.</p>
                    </div>
                    <Button variant="destructive" onClick={() => setShowDisable2faDialog(true)}>
                      Disable 2FA
                    </Button>
                  </div>
                ) : (
                  <div>
                    {!qrCodeSvg ? (
                      <div className="bg-muted/30 border p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h4 className="font-semibold">Two-factor authentication is currently disabled.</h4>
                          <p className="text-xs text-muted-foreground mt-1">Protect your account from unauthorized access by configuring TOTP.</p>
                        </div>
                        <Button onClick={handleInitiate2FA} disabled={twoFactorLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          {twoFactorLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Enable 2FA"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6 border p-6 rounded-xl bg-muted/10 border-muted">
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                          <div 
                            className="bg-white p-3 border rounded-xl flex items-center justify-center w-[220px] h-[220px]"
                            dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                          />
                          <div className="space-y-4 flex-1">
                            <h4 className="font-semibold text-lg">Configure Authenticator App</h4>
                            <p className="text-sm text-muted-foreground">
                              1. Scan the QR code with your authenticator app (e.g. Google Authenticator, Authy, 1Password).
                            </p>
                            <p className="text-sm text-muted-foreground">
                              2. Or manually enter this secret setup key: 
                              <code className="block mt-1 p-1 bg-muted font-mono rounded text-xs select-all w-fit">{totpSecret}</code>
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <form onSubmit={handleConfirm2FA} className="space-y-4 max-w-md">
                          <div className="grid gap-2">
                            <Label htmlFor="verification-code">Verification Code</Label>
                            <Input
                              id="verification-code"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              placeholder="Enter the 6-digit code from your app"
                              required
                              maxLength={6}
                              className="font-mono text-center text-lg tracking-widest"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" disabled={twoFactorLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                              Verify & Activate
                            </Button>
                            <Button variant="outline" onClick={() => { setQrCodeSvg(null); setTotpSecret(null); }}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card className="border border-muted shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-indigo-600" />
                    Active Sessions
                  </CardTitle>
                  <CardDescription>Manage active sessions and logged-in devices associated with your account.</CardDescription>
                </div>
                {sessions.length > 1 && (
                  <Button variant="outline" onClick={handleRevokeAllOthers} className="text-red-600 hover:text-red-700 border-red-200">
                    Log out other devices
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active sessions found.</p>
                ) : (
                  <div className="border rounded-lg divide-y bg-background">
                    {sessions.map((session) => (
                      <div key={session.id} className="p-4 flex justify-between items-center gap-4 hover:bg-muted/10 transition-colors">
                        <div className="flex items-start gap-3">
                          <Monitor className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold">{session.name || "Unknown Device"}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Created on {new Date(session.created_at).toLocaleString()}
                            </p>
                            {session.last_used_at && (
                              <p className="text-xs text-muted-foreground/80 mt-0.5">
                                Last active: {new Date(session.last_used_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50/50"
                        >
                          Revoke
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Zone Tab */}
          <TabsContent value="danger">
            <Card className="border-red-200 border bg-red-50/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Danger Zone
                </CardTitle>
                <CardDescription>Irreversible and critical account management options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-red-100/10 border border-red-200 p-4 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-red-950">Delete Account</h4>
                    <p className="text-xs text-muted-foreground mt-1">Permanently delete your profile, organizations, and all associate data.</p>
                  </div>
                  <Button variant="destructive" onClick={() => { setDeleteError(null); setShowDeleteDialog(true); }}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal: Disable 2FA Password Gate */}
        <AlertDialog open={showDisable2faDialog} onOpenChange={setShowDisable2faDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disable Two-Factor Authentication</AlertDialogTitle>
              <AlertDialogDescription>
                To disable 2FA, please enter your current account password to verify your identity.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="disable-2fa-password">Account Password</Label>
                <Input
                  id="disable-2fa-password"
                  type="password"
                  value={disable2faPassword}
                  onChange={(e) => setDisable2faPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDisable2faPassword("")}>Cancel</AlertDialogCancel>
              <Button variant="destructive" onClick={handleDisable2FA} disabled={twoFactorLoading}>
                {twoFactorLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Disable"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal: Delete Account Gate */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="border-red-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Permanent Account Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                This action is irreversible. It will permanently delete your account details, memberships, and revoke access tokens.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4 space-y-4">
              {deleteError && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm">
                  {deleteError}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="delete-confirm-text">
                  To confirm, type <span className="font-bold select-none text-foreground bg-muted p-0.5 rounded">DELETE</span> below:
                </Label>
                <Input
                  id="delete-confirm-text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="delete-account-password">Enter Password</Label>
                <Input
                  id="delete-account-password"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your account password"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => { setDeletePassword(""); setDeleteConfirmText(""); setDeleteError(null); }}>
                Cancel
              </AlertDialogCancel>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading}>
                {deleteLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "I understand, delete my account"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit changes**
  
  Run in `/Users/mbp/Desktop/Code/tracerpro-new`:
  ```bash
  git add app/dashboard/profile/page.tsx
  git commit -m "feat: complete user profile settings dashboard and authentication controls"
  ```
