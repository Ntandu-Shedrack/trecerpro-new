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
import { ScanBarcode, ShieldCheck, Cpu, Layers, Wifi, Shield } from "lucide-react";

export type AuthMode = "signin" | "signup" | "forgot-password" | "reset-password";

const testimonials = [
  {
    quote: "TracerPro transformed our heavy machinery logistics. We cut asset recovery times from days to mere hours.",
    author: "Sarah Jenkins",
    role: "VP of Operations, BuildCorp",
  },
  {
    quote: "The real-time geofencing and instant API triggers integrated flawlessly with our existing ERP software.",
    author: "Marcus Vance",
    role: "Director of Supply Chain, LogisticsOne",
  },
  {
    quote: "Highly secure, multi-tenant asset telemetry that just works. Our operations team can't live without it.",
    author: "Elena Rostova",
    role: "CTO, heavyIndustries",
  },
];

interface AuthFormProps {
  initialMode?: AuthMode;
}

export default function AuthForm({ initialMode = "signin" }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthContext();

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [telemetrySignal, setTelemetrySignal] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetrySignal((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen grid lg:grid-cols-12 w-full relative z-10">
      {/* Background Aurora Blobs */}
      <div className="absolute top-0 right-0 w-[45%] h-[45%] bg-primary/10 rounded-full blur-[120px] animate-aurora-1 -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-indigo-500/10 rounded-full blur-[100px] animate-aurora-2 -z-10 pointer-events-none" />

      {/* Left Column - Auth Form Container */}
      <div className="col-span-12 lg:col-span-5 flex flex-col justify-center p-6 md:p-12 lg:p-16 relative">
        <div className="w-full max-w-md mx-auto">
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
                className="glass-card w-full overflow-hidden rounded-3xl shadow-xl p-8"
              >
                <div className="text-center">
                  <Link href="/" aria-label="go home" className="mx-auto block w-fit hover:scale-105 transition-transform">
                    <LogoIcon />
                  </Link>

                  {mode === "signin" && (
                    <>
                      <h1 className="mb-1 mt-6 text-2xl font-black text-foreground tracking-tight">Welcome Back</h1>
                      <p className="text-sm text-muted-foreground">Sign in to your TracerPro account</p>
                    </>
                  )}

                  {mode === "signup" && (
                    <>
                      <h1 className="mb-1 mt-6 text-2xl font-black text-foreground tracking-tight">Get Started</h1>
                      <p className="text-sm text-muted-foreground">Empower your asset tracking today</p>
                    </>
                  )}

                  {mode === "forgot-password" && (
                    <>
                      <h1 className="mb-1 mt-6 text-2xl font-black text-foreground tracking-tight">
                        Reset Password
                      </h1>
                      <p className="text-sm text-muted-foreground">Enter your email to receive a recovery link</p>
                    </>
                  )}

                  {mode === "reset-password" && (
                    <>
                      <h1 className="mb-1 mt-6 text-2xl font-black text-foreground tracking-tight">
                        Set New Password
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Configure your new credentials.
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  {mode === "signup" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstname" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Firstname
                        </Label>
                        <Input
                          type="text"
                          required
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          name="firstname"
                          id="firstname"
                          className="bg-background border border-border/80 rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastname" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Lastname
                        </Label>
                        <Input
                          type="text"
                          required
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          name="lastname"
                          id="lastname"
                          className="bg-background border border-border/80 rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  )}

                  {(mode === "signin" ||
                    mode === "signup" ||
                    mode === "forgot-password" ||
                    mode === "reset-password") && (
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                        className="bg-background border border-border/80 rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                      />
                    </div>
                  )}

                  {mode === "reset-password" && (
                    <div className="space-y-2">
                      <Label htmlFor="resetToken" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                        className="bg-background border border-border/80 rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                      />
                    </div>
                  )}

                  {(mode === "signin" ||
                    mode === "signup" ||
                    mode === "reset-password") && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pwd" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Password
                        </Label>
                        {mode === "signin" && (
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={() => setMode("forgot-password")}
                            className="px-0 text-xs text-primary hover:text-primary/80 font-semibold"
                          >
                            Forgot?
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
                        className="bg-background border border-border/80 rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                      />
                    </div>
                  )}

                  {mode === "reset-password" && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Confirm Password
                      </Label>
                      <Input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        name="confirmPassword"
                        id="confirmPassword"
                        className="bg-background border border-border/80 rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                      />
                    </div>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground transition-all shadow-md shadow-primary/10 active:scale-[0.98] h-12 rounded-xl text-sm font-bold mt-2"
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
                      <hr className="border-border/60" />
                      <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
                      <hr className="border-border/60" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button type="button" variant="outline" className="flex items-center gap-2 hover:bg-muted rounded-xl h-11 border border-border/80 font-bold active:scale-[0.98] transition-transform" onClick={() => toast.info("Google Authentication coming soon!")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                          <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
                          <path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
                          <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" />
                          <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
                        </svg>
                        <span>Google</span>
                      </Button>
                      <Button type="button" variant="outline" className="flex items-center gap-2 hover:bg-muted rounded-xl h-11 border border-border/80 font-bold active:scale-[0.98] transition-transform" onClick={() => toast.info("Microsoft Authentication coming soon!")}>
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
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-center">
            {mode === "signin" ? (
              <p className="text-xs text-muted-foreground font-semibold">
                Don&apos;t have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode("signup")}
                  className="px-0 text-xs font-bold text-primary hover:text-primary/80"
                >
                  Sign Up
                </Button>
              </p>
            ) : mode === "signup" ? (
              <p className="text-xs text-muted-foreground font-semibold">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode("signin")}
                  className="px-0 text-xs font-bold text-primary hover:text-primary/80"
                >
                  Sign In
                </Button>
              </p>
            ) : (
              <Button
                type="button"
                variant="link"
                onClick={() => setMode("signin")}
                className="px-0 text-xs font-bold text-primary hover:text-primary/80"
              >
                Back to Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Telemetry Showcase */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-16 bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/20 border-l border-border/30 overflow-hidden select-none">
        {/* Decorative Grid & Glows */}
        <div className="absolute inset-0 bg-dot-grid opacity-30 -z-10" />
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] animate-aurora-2 -z-10" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] animate-aurora-3 -z-10" />

        {/* Top Header info */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="bg-primary/10 p-2 rounded-xl text-primary border border-primary/20 shadow-md">
            <ScanBarcode className="h-6 w-6" />
          </div>
          <span className="text-md font-black tracking-tight text-white">
            Tracer<span className="text-primary">Pro</span> Enterprise
          </span>
        </div>

        {/* Live Widget block */}
        <div className="w-full max-w-lg space-y-6 relative z-10">
          <div className="glass-card rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-border/20 pb-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Wifi className={`h-4 w-4 text-green-400 ${telemetrySignal ? 'opacity-100 scale-110' : 'opacity-70'} transition-all duration-300`} />
                  Live IoT Beacons
                </h4>
                <p className="text-xs text-zinc-400">Pings received from active job-site assets</p>
              </div>
              <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                System Active
              </span>
            </div>

            {/* Mock Telemetry list */}
            <div className="space-y-3">
              {[
                { name: "Caterpillar D8T Excavator", tag: "CAT-384", speed: "12 mph", status: "Active", signal: "Excellent" },
                { name: "Toyota 8FGU25 Forklift", tag: "TOY-092", speed: "4 mph", status: "Active", signal: "Good" },
                { name: "Cummins 250kW Generator", tag: "CUM-441", speed: "0 mph", status: "Idle", signal: "Excellent" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/10">
                      <Cpu className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{item.name}</h5>
                      <p className="text-[10px] text-zinc-400">{item.tag} • Speed: {item.speed}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${item.status === "Active" ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
                      <span className="text-[10px] font-bold text-white">{item.status}</span>
                    </div>
                    <span className="text-[9px] text-zinc-500">Signal: {item.signal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: "3,842", lab: "IoT Assets" },
              { val: "99.98%", lab: "Uptime" },
              { val: "< 0.4s", lab: "Latency" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 text-center border border-white/5">
                <h4 className="text-lg font-black text-white">{stat.val}</h4>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{stat.lab}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rotating Testimonials block */}
        <div className="w-full max-w-lg min-h-[90px] relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-2 border-l-2 border-primary/30 pl-4"
            >
              <p className="text-sm italic text-zinc-300 font-medium leading-relaxed">
                &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
              </p>
              <div>
                <h5 className="text-xs font-bold text-white">
                  {testimonials[activeTestimonial].author}
                </h5>
                <p className="text-[10px] text-zinc-400">
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
