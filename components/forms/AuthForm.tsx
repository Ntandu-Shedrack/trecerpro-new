"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanBarcode } from "lucide-react";
import Link from "next/link";

type AuthMode =
  | "sign-in"
  | "sign-up"
  | "forgot-password"
  | "verify-email"
  | "reset-password";

interface AuthFormProps {
  mode?: AuthMode;
}

export default function AuthForm({ mode = "sign-in" }: AuthFormProps) {
  const isSignUp = mode === "sign-up";
  const isSignIn = mode === "sign-in";
  const isForgotPassword = mode === "forgot-password";
  const isVerifyEmail = mode === "verify-email";
  const isResetPassword = mode === "reset-password";

  // Submit button text based on mode
  const submitText = (() => {
    switch (mode) {
      case "sign-up":
        return "Create account";
      case "sign-in":
        return "Sign in";
      case "forgot-password":
        return "Send reset link";
      case "verify-email":
        return "Verify email";
      case "reset-password":
        return "Reset password";
      default:
        return "Submit";
    }
  })();

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-white py-24 overflow-hidden">
      <form className="bg-white mx-auto h-fit w-full max-w-md lg:max-w-lg overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-lg shadow-primary/40">
        <div className="bg-white -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          {/* Header */}
          <div className="text-center">
            <Link href="/" aria-label="Go home" className="mx-auto block w-fit">
              <div className="relative inline-flex">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#1C162A]/40 via-[#FFDD9B]/40 to-[#2FD8FE]/40 blur-lg" />
                <ScanBarcode className="text-slate-800" />
                <span className="text-lg text-slate-800 font-bold tracking-tight">
                  Tracer<span className="text-primary">Pro</span>
                </span>
              </div>
            </Link>

            <h1 className="mb-1 mt-4 text-3xl text-primary font-semibold">
              {isSignUp
                ? "Create a TracerPro account"
                : isSignIn
                  ? "Sign in to TracerPro"
                  : isForgotPassword
                    ? "Forgot your password?"
                    : isVerifyEmail
                      ? "Verify your email"
                      : isResetPassword
                        ? "Reset your password"
                        : ""}
            </h1>

            <p className="text-sm text-muted">
              {isSignUp
                ? "Start managing your Assets with Easy"
                : isSignIn
                  ? "Welcome back. Continue where you left off"
                  : isForgotPassword
                    ? "Enter your email to receive a password reset link"
                    : isVerifyEmail
                      ? "Enter the verification code sent to your email"
                      : isResetPassword
                        ? "Set a new password for your account"
                        : ""}
            </p>
          </div>

          {/* Form fields */}
          <div className="mt-6 space-y-6">
            {/* Sign up fields */}
            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-accent-foreground" htmlFor="firstname">
                    First name
                  </Label>
                  <Input
                    id="firstname"
                    name="firstname"
                    className="text-muted border border-muted-foreground/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground" htmlFor="lastname">
                    Last name
                  </Label>
                  <Input
                    id="lastname"
                    name="lastname"
                    className="text-muted border border-muted-foreground/50"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email field (all modes except reset-password) */}
            {(isSignUp || isSignIn || isForgotPassword || isVerifyEmail) && (
              <div className="space-y-2">
                <Label className="text-accent-foreground" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="text-muted border border-muted-foreground/50"
                  required
                  placeholder="you@company.com"
                />
              </div>
            )}

            {/* Password fields */}
            {(isSignUp || isSignIn || isResetPassword) && (
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <Label className="text-accent-foreground" htmlFor="password">
                    Password
                  </Label>

                  {!isSignUp && isSignIn && (
                    <Button asChild variant="link" size="sm">
                      <Link href="/forgot-password" className="text-sm">
                        Forgot password?
                      </Link>
                    </Button>
                  )}
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="text-muted border border-muted-foreground/50"
                  required
                  placeholder={isResetPassword ? "New password" : undefined}
                />
              </div>
            )}

            {/* Verify code field */}
            {isVerifyEmail && (
              <div className="space-y-2">
                <Label className="text-accent-foreground" htmlFor="code">
                  Verification code
                </Label>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  className="text-muted border border-muted-foreground/50"
                  required
                  placeholder="Enter the code"
                />
              </div>
            )}

            {/* Confirm password for sign-up and reset-password */}
            {(isSignUp || isResetPassword) && (
              <div className="space-y-2">
                <Label
                  className="text-accent-foreground"
                  htmlFor="confirmPassword"
                >
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="text-muted border-muted-foreground/50"
                  required
                />
              </div>
            )}

            {/* Submit */}
            <Button className="w-full text-white">{submitText}</Button>
          </div>

          {/* Divider & OAuth (only for sign-in and sign-up) */}
          {(isSignUp || isSignIn) && (
            <>
              <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <hr className="border-dashed" />
                <span className="text-muted-foreground text-xs">
                  Or continue with
                </span>
                <hr className="border-dashed" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="0.98em"
                    height="1em"
                    viewBox="0 0 256 262"
                  >
                    <path
                      fill="#4285f4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    ></path>
                    <path
                      fill="#34a853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    ></path>
                    <path
                      fill="#fbbc05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                    ></path>
                    <path
                      fill="#eb4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    ></path>
                  </svg>

                  <span className="text-accent-foreground">Google</span>
                </Button>

                <Button type="button" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 256 256"
                  >
                    <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z" />
                    <path fill="#80cc28" d="M256 121.666H134.335V0H256z" />
                    <path
                      fill="#00adef"
                      d="M121.663 256.002H0V134.336h121.663z"
                    />
                    <path
                      fill="#fbbc09"
                      d="M256 256.002H134.335V134.336H256z"
                    />
                  </svg>
                  <span className="text-accent-foreground">Microsoft</span>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer switch */}
        {(isSignUp || isSignIn) && (
          <div className="p-3 text-center text-sm text-muted-foreground">
            {isSignUp ? (
              <>
                Already have an account?
                <Button asChild variant="link" className="px-2">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </>
            ) : (
              <>
                Don&apos;t have an account?
                <Button asChild variant="link" className="px-2">
                  <Link href="/sign-up">Create one</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </form>
    </section>
  );
}
