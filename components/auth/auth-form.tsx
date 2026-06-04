"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/auth-context";
import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  usePathname,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export type AuthMode = "signin" | "signup" | "forgot-password" | "reset-password";

interface AuthFormProps {
  initialMode?: AuthMode;
}

export default function AuthForm({ initialMode = "signin" }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams<{ rest?: string[] }>();

  // Form states
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const queryToken =
    searchParams.get("token") ||
    searchParams.get("reset_token") ||
    searchParams.get("resetToken") ||
    searchParams.get("access_token");
  const queryEmail =
    searchParams.get("email") ||
    searchParams.get("user_email") ||
    searchParams.get("reset_email");

  const pathToken = params?.rest?.[0];

  // Fallback: allow `/reset-password/<token>` links where token is in the path.
  const tokenFromPathname = (() => {
    const prefix = "/reset-password/";
    if (!pathname || !pathname.startsWith(prefix)) return "";
    const rest = pathname.slice(prefix.length);
    if (!rest) return "";
    const firstSegment = rest.split("/")[0];
    if (!firstSegment) return "";
    try {
      return decodeURIComponent(firstSegment);
    } catch {
      return firstSegment;
    }
  })();

  const effectiveResetToken = queryToken || pathToken || tokenFromPathname;

  useEffect(() => {
    if (mode !== "reset-password") return;

    // Prefill from reset link params, but don't overwrite user input.
    if (queryEmail && !email) setEmail(queryEmail);
    if (effectiveResetToken && !resetToken) setResetToken(effectiveResetToken);
  }, [mode, queryEmail, effectiveResetToken, email, resetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signin") {
        await login(email, password);
        toast.success("Successfully signed in!");
      } else if (mode === "signup") {
        const fullname = `${firstname} ${lastname}`.trim();
        await register(fullname, email, password);
        toast.success("Account created successfully!");
      } else if (mode === "forgot-password") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to send reset link");
        }
        toast.success(data.message || "Password reset link sent! Check your email.");
        setMode("signin");
      } else if (mode === "reset-password") {
        if (!resetToken) {
          throw new Error("Reset token is required");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const payload: Record<string, unknown> = {
          token: resetToken,
          password,
          password_confirmation: confirmPassword,
        };
        // Some reset flows include email; others may infer from token.
        if (email) payload.email = email;

        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to reset password");
        }

        toast.success(
          data.message || "Password reset successful. Please sign in."
        );
        router.push("/sign-in");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-muted w-full overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
          >
            <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
              <div className="text-center">
                <Link href="/" aria-label="go home" className="mx-auto block w-fit">
                  <LogoIcon />
                </Link>

                {mode === "signin" && (
                  <>
                    <h1 className="mb-1 mt-4 text-xl font-semibold">Welcome Back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to your TracerPro account</p>
                  </>
                )}

                {mode === "signup" && (
                  <>
                    <h1 className="mb-1 mt-4 text-xl font-semibold">Create a TracerPro Account</h1>
                    <p className="text-sm text-muted-foreground">Get started with asset management today</p>
                  </>
                )}

                {mode === "forgot-password" && (
                  <>
                    <h1 className="mb-1 mt-4 text-xl font-semibold">
                      Forgot your password?
                    </h1>
                    <p className="text-sm text-muted-foreground">Enter your email to receive a reset link</p>
                  </>
                )}

                {mode === "reset-password" && (
                  <>
                    <h1 className="mb-1 mt-4 text-xl font-semibold">
                      Set a New Password
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Enter your new password to complete the reset.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {mode === "signup" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstname" className="block text-sm">
                        Firstname
                      </Label>
                      <Input
                        type="text"
                        required
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        name="firstname"
                        id="firstname"
                        className="bg-background border border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastname" className="block text-sm">
                        Lastname
                      </Label>
                      <Input
                        type="text"
                        required
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        name="lastname"
                        id="lastname"
                        className="bg-background border border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                )}

                {(mode === "signin" ||
                  mode === "signup" ||
                  mode === "forgot-password" ||
                  mode === "reset-password") && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="block text-sm">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      required={mode !== "reset-password"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      id="email"
                      placeholder="name@example.com"
                      className="bg-background border border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                  </div>
                )}

                {mode === "reset-password" && (
                  <div className="space-y-2">
                    <Label htmlFor="resetToken" className="block text-sm">
                      Reset Token
                    </Label>
                    <Input
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      name="resetToken"
                      id="resetToken"
                      placeholder="Paste token from email"
                      className="bg-background border border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                  </div>
                )}

                {(mode === "signin" ||
                  mode === "signup" ||
                  mode === "reset-password") && (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pwd" className="text-sm">
                        Password
                      </Label>
                      {mode === "signin" && (
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={() => setMode("forgot-password")}
                          className="px-0 text-xs text-primary hover:text-primary/80 font-medium"
                        >
                          Forgot password?
                        </Button>
                      )}
                    </div>
                    <Input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="pwd"
                      id="pwd"
                      className="bg-background border border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                  </div>
                )}

                {mode === "reset-password" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="block text-sm">
                      Confirm Password
                    </Label>
                    <Input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      name="confirmPassword"
                      id="confirmPassword"
                      className="bg-background border border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                  </div>
                )}

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md mt-2"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : mode === "signin"
                    ? "Sign In"
                    : mode === "signup"
                    ? "Sign Up"
                    : mode === "reset-password"
                      ? "Reset Password"
                      : "Send Reset Link"}
                </Button>
              </div>

              {(mode === "signin" || mode === "signup") && (
                <>
                  <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <hr className="border-dashed border-border" />
                    <span className="text-muted-foreground text-xs">Or continue With</span>
                    <hr className="border-dashed border-border" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant="outline" className="flex items-center gap-2 hover:bg-muted" onClick={() => toast.info("Google Authentication coming soon!")}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                        <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
                        <path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
                        <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" />
                        <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
                      </svg>
                      <span>Google</span>
                    </Button>
                    <Button type="button" variant="outline" className="flex items-center gap-2 hover:bg-muted" onClick={() => toast.info("Microsoft Authentication coming soon!")}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
                        <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z" />
                        <path fill="#80cc28" d="M256 121.666H134.335V0H256z" />
                        <path fill="#00adef" d="M121.663 256.002H0V134.336h121.663z" />
                        <path fill="#fbbc09" d="M256 256.002H134.335V134.336H256z" />
                      </svg>
                      <span>Microsoft</span>
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="p-3 text-center">
              {mode === "signin" ? (
                <p className="text-xs text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode("signup")}
                    className="px-0 text-xs font-semibold text-primary hover:text-primary/80"
                  >
                    Sign Up
                  </Button>
                </p>
              ) : mode === "signup" ? (
                <p className="text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode("signin")}
                    className="px-0 text-xs font-semibold text-primary hover:text-primary/80"
                  >
                    Sign In
                  </Button>
                </p>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode("signin")}
                  className="px-0 text-xs font-semibold text-primary hover:text-primary/80"
                >
                  Back to Sign In
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
