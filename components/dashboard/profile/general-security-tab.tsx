"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/types";
import {
  updateProfile,
  updatePassword,
  enableTwoFactor,
  confirmTwoFactor,
  disableTwoFactor,
} from "@/actions/profile.actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  KeyRound,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ShieldAlert,
  Copy,
  Check,
  User as UserIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface GeneralSecurityTabProps {
  user: User;
  refreshUser: () => Promise<void>;
}

export function GeneralSecurityTab({ user, refreshUser }: GeneralSecurityTabProps) {
  // Profile Details Form State
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 2FA State
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [twoFactorMsg, setTwoFactorMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [disable2faPassword, setDisable2faPassword] = useState("");
  const [showDisable2faDialog, setShowDisable2faDialog] = useState(false);

  useEffect(() => {
    setName(user.name || "");
    setEmail(user.email || "");
  }, [user]);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const is2faActive = !!user.two_factor_confirmed_at;

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="border border-border bg-card shadow-sm rounded-xl">
        <form onSubmit={handleUpdateProfile}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              Profile Details
            </CardTitle>
            <CardDescription>Update your personal information and profile configurations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {profileMsg && (
              <div className={`p-4 rounded-xl flex items-center gap-2 border text-sm animate-in slide-in-from-top-1 duration-200 ${
                profileMsg.type === "success" 
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}>
                {profileMsg.type === "success" ? <CheckCircle className="h-4.5 w-4.5 shrink-0" /> : <ShieldAlert className="h-4.5 w-4.5 shrink-0" />}
                <span>{profileMsg.text}</span>
              </div>
            )}
            <div className="grid gap-5 max-w-lg">
              <div className="grid gap-2">
                <Label htmlFor="profile-name" className="text-sm font-semibold">Full Name</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="h-10 transition-all duration-200 focus-visible:ring-primary focus-visible:border-primary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profile-email" className="text-sm font-semibold">Email Address</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="h-10 transition-all duration-200 focus-visible:ring-primary focus-visible:border-primary"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/80 px-6 py-4">
            <Button type="submit" disabled={profileLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5">
              {profileLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Save Profile"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Password Change Card */}
      <Card className="border border-border bg-card shadow-sm rounded-xl">
        <form onSubmit={handleUpdatePassword}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Change Password
            </CardTitle>
            <CardDescription>Secure your profile with a new password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {passwordMsg && (
              <div className={`p-4 rounded-xl flex items-center gap-2 border text-sm animate-in slide-in-from-top-1 duration-200 ${
                passwordMsg.type === "success" 
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}>
                {passwordMsg.type === "success" ? <CheckCircle className="h-4.5 w-4.5 shrink-0" /> : <ShieldAlert className="h-4.5 w-4.5 shrink-0" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}
            <div className="grid gap-5 max-w-lg">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-10 transition-all duration-200 focus-visible:ring-primary focus-visible:border-primary"
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
                  placeholder="Minimum 8 characters"
                  className="h-10 transition-all duration-200 focus-visible:ring-primary focus-visible:border-primary"
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
                  placeholder="Retype your new password"
                  className="h-10 transition-all duration-200 focus-visible:ring-primary focus-visible:border-primary"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/80 px-6 py-4">
            <Button type="submit" disabled={passwordLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5">
              {passwordLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Two Factor Card */}
      <Card className="border border-border bg-card shadow-sm rounded-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Protect your user workspace by enabling TOTP security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {twoFactorMsg && (
            <div className={`p-4 rounded-xl flex items-center gap-2 border text-sm ${
              twoFactorMsg.type === "success" 
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}>
              {twoFactorMsg.type === "success" ? <CheckCircle className="h-4.5 w-4.5 shrink-0" /> : <ShieldAlert className="h-4.5 w-4.5 shrink-0" />}
              <span>{twoFactorMsg.text}</span>
            </div>
          )}

          {recoveryCodes.length > 0 && (
            <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
              <h4 className="font-bold text-primary text-sm flex gap-1.5 items-center">
                <AlertTriangle className="h-4.5 w-4.5" /> Save these backup recovery codes
              </h4>
              <p className="text-xs text-muted-foreground">If you lose your device, these codes can be used to recover access. Keep them in a password manager.</p>
              <div className="grid grid-cols-2 gap-2 pt-1.5">
                {recoveryCodes.map((code) => (
                  <code key={code} className="text-xs font-mono bg-card p-2 border border-border/80 rounded-lg text-center select-all tracking-wider font-semibold text-foreground/80">{code}</code>
                ))}
              </div>
            </div>
          )}

          {is2faActive ? (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-500/5 border border-emerald-500/15 p-5 rounded-xl">
              <div>
                <h4 className="font-bold text-emerald-750 flex gap-2 items-center text-sm sm:text-base">
                  <CheckCircle className="h-5 w-5 text-emerald-600" /> Two-factor authentication is active
                </h4>
                <p className="text-xs text-muted-foreground mt-1">Sign-ins will require confirmation codes generated by your authentication app.</p>
              </div>
              <Button variant="outline" onClick={() => setShowDisable2faDialog(true)} className="text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/20">
                Disable 2FA
              </Button>
            </div>
          ) : (
            <div>
              {!qrCodeSvg ? (
                <div className="bg-muted/10 border border-border p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Two-factor authentication is disabled</h4>
                    <p className="text-xs text-muted-foreground mt-1">Secure your profile workspace using Google Authenticator, 1Password, or Authy.</p>
                  </div>
                  <Button onClick={handleInitiate2FA} disabled={twoFactorLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5">
                    {twoFactorLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Enable 2FA"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 border border-border p-6 rounded-xl bg-muted/5">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div 
                      className="bg-white p-3 border border-border rounded-xl flex items-center justify-center w-[220px] h-[220px] shadow-inner shrink-0"
                      dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                    />
                    <div className="space-y-4 flex-1">
                      <h4 className="font-bold text-lg text-foreground flex gap-1.5 items-center">
                        <Shield className="h-5 w-5 text-primary" /> Setup Authenticator App
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        1. Scan the QR code using your authenticator application (Google Authenticator, Authy, or Microsoft Authenticator).
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        2. Or manually enter the secret setup key: 
                      </p>
                      <div className="flex items-center gap-2 max-w-sm mt-1">
                        <code className="block flex-1 p-2.5 bg-muted font-mono rounded-lg text-xs select-all truncate border border-border text-foreground font-bold">{totpSecret}</code>
                        <Button size="icon" variant="outline" onClick={() => copyToClipboard(totpSecret || "")} className="h-9 w-9 shrink-0">
                          {copiedSecret ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <form onSubmit={handleConfirm2FA} className="space-y-4 max-w-md">
                    <div className="grid gap-2">
                      <Label htmlFor="verification-code" className="text-sm font-semibold">Enter 6-Digit Code</Label>
                      <Input
                        id="verification-code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000 000"
                        required
                        maxLength={6}
                        className="font-mono text-center text-xl tracking-widest h-11 focus-visible:ring-primary focus-visible:border-primary"
                      />
                    </div>
                    <div className="flex gap-2.5">
                      <Button type="submit" disabled={twoFactorLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5">
                        Verify & Enable
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

      {/* Modal: Disable 2FA Password Gate */}
      <AlertDialog open={showDisable2faDialog} onOpenChange={setShowDisable2faDialog}>
        <AlertDialogContent className="rounded-xl border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Disable Two-Factor Authentication</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Please enter your password to confirm and disable two-factor authentication on your account.
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
                placeholder="Enter password"
                className="focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDisable2faPassword("")} className="font-semibold">Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDisable2FA} disabled={twoFactorLoading} className="font-semibold">
              {twoFactorLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Disable 2FA"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
