"use client";

import { Suspense } from "react";
import AuthForm from "@/components/auth/auth-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm initialMode="reset-password" />
    </Suspense>
  );
}

