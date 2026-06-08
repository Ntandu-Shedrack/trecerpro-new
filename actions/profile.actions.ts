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
