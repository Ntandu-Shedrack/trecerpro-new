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
import { 
  Shield, 
  KeyRound, 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Trash2, 
  ShieldAlert, 
  Copy, 
  Check, 
  Mail, 
  User, 
  Smartphone, 
  Laptop, 
  Calendar, 
  Lock 
} from "lucide-react";
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
  const [copiedSecret, setCopiedSecret] = useState(false);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const getDeviceIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes("iphone") || lowercaseName.includes("android") || lowercaseName.includes("mobile")) {
      return <Smartphone className="h-5 w-5 text-primary" />;
    }
    if (lowercaseName.includes("mac") || lowercaseName.includes("windows") || lowercaseName.includes("linux")) {
      return <Laptop className="h-5 w-5 text-primary" />;
    }
    return <Monitor className="h-5 w-5 text-primary" />;
  };

  if (!rawUser) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = rawUser.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";
  const is2faActive = !!rawUser.two_factor_confirmed_at;

  return (
    <div className="container max-w-5xl py-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Premium Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 transition-all duration-300 hover:shadow-md">
        
        {/* Subtle decorative background gradient matching primary */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20" />
        
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-primary ring-4 ring-primary/10 transition-transform duration-300 hover:scale-105">
            <AvatarFallback className="bg-primary/5 text-primary text-3xl font-extrabold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{rawUser.name}</h1>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15 border-none px-3 py-1 font-semibold text-xs rounded-full">
                {rawUser.organizations?.[0]?.pivot?.role || "Member"}
              </Badge>
              {is2faActive && (
                <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 px-3 py-1 font-semibold text-xs rounded-full flex gap-1 items-center">
                  <Shield className="h-3.5 w-3.5" /> 2FA Secured
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-muted-foreground/70" />
              {rawUser.email}
            </span>
            <span className="hidden sm:inline text-muted-foreground/45">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground/70" />
              Member since {new Date(rawUser.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
            </span>
          </div>
        </div>
      </div>

      {/* Styled Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-full overflow-x-auto justify-start border-b border-border bg-transparent p-0 h-auto gap-6 rounded-none">
          <TabsTrigger 
            value="general" 
            className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 font-semibold transition-all duration-200"
          >
            General
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 font-semibold transition-all duration-200"
          >
            Security
          </TabsTrigger>
          <TabsTrigger 
            value="sessions" 
            className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 font-semibold transition-all duration-200"
          >
            Sessions
          </TabsTrigger>
          <TabsTrigger 
            value="danger" 
            className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-destructive data-[state=active]:bg-transparent data-[state=active]:text-destructive px-1 font-semibold transition-all duration-200"
          >
            Danger Zone
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="outline-none">
          <Card className="border border-border bg-card shadow-sm rounded-xl">
            <form onSubmit={handleUpdateProfile}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
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
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 outline-none">
          
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
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="outline-none">
          <Card className="border border-border bg-card shadow-sm rounded-xl">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  Active Sessions
                </CardTitle>
                <CardDescription>Terminates or inspects other authenticated device tokens.</CardDescription>
              </div>
              {sessions.length > 1 && (
                <Button variant="outline" onClick={handleRevokeAllOthers} className="text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/20 font-semibold text-xs">
                  Log out other devices
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              {sessionsLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active sessions found.</p>
              ) : (
                <div className="border border-border rounded-xl divide-y divide-border bg-card overflow-hidden">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-muted/5 transition-colors duration-200">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/5 p-2 rounded-lg border border-primary/10">
                          {getDeviceIcon(session.name)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-foreground">{session.name || "Unknown Device"}</p>
                            {session.id === sessions[0]?.id && (
                              <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/10 rounded-full px-2 py-0 font-semibold text-[10px]">
                                Current Session
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Started: {new Date(session.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                          </p>
                          {session.last_used_at && (
                            <p className="text-xs text-muted-foreground/80 mt-0.5">
                              Last used: {new Date(session.last_used_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-destructive hover:bg-destructive/5 hover:text-destructive font-semibold"
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
        <TabsContent value="danger" className="outline-none">
          <Card className="border border-destructive/20 bg-destructive/5 shadow-sm rounded-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-bold text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Danger Zone
              </CardTitle>
              <CardDescription className="text-destructive/80">Destructive, permanent settings. Please exercise caution.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background border border-destructive/15 p-5 rounded-xl shadow-inner">
                <div>
                  <h4 className="font-bold text-foreground text-sm sm:text-base flex gap-1.5 items-center">
                    <Trash2 className="h-4.5 w-4.5 text-destructive" />
                    Delete Account
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Permanently remove your profile details, active organization memberships, and delete all associated data.</p>
                </div>
                <Button variant="destructive" onClick={() => { setDeleteError(null); setShowDeleteDialog(true); }} className="font-bold">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

      {/* Modal: Delete Account Gate */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-xl border border-destructive/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Permanent Account Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action is permanent and completely irreversible. It deletes all memberships and revokes your tokens.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            {deleteError && (
              <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-sm">
                {deleteError}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="delete-confirm-text" className="text-sm">
                To confirm, type <span className="font-bold select-none text-destructive bg-destructive/5 border border-destructive/10 px-1.5 py-0.5 rounded-md text-xs">DELETE</span> below:
              </Label>
              <Input
                id="delete-confirm-text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="focus-visible:ring-destructive focus-visible:border-destructive text-center uppercase tracking-wider font-semibold"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="delete-account-password">Enter Password</Label>
              <Input
                id="delete-account-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter password"
                required
                className="focus-visible:ring-destructive focus-visible:border-destructive"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeletePassword(""); setDeleteConfirmText(""); setDeleteError(null); }} className="font-semibold">
              Cancel
            </AlertDialogCancel>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading} className="font-semibold">
              {deleteLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Permanently Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
