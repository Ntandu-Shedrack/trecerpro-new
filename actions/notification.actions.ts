"use server";

import api from "@/lib/api";

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  type: "system" | "security" | "organization" | "asset";
  priority: "info" | "warning" | "critical";
  read: boolean;
  created_at: string;
  link?: string;
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
}

export async function getNotifications(): Promise<{
  data: SystemNotification[];
  error: string | null;
}> {
  try {
    const response = await api.get("/api/notifications");
    return { data: response.data.data as SystemNotification[], error: null };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.warn("Laravel notifications endpoint failed or is not implemented yet. Falling back to local storage.", err.message);
    return { data: [], error: "fallback_needed" };
  }
}

export async function markAsRead(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    await api.post(`/api/notifications/${id}/read`);
    return { success: true, error: null };
  } catch (error: unknown) {
    const err = error as { message?: string };
    return { success: false, error: err.message ?? "Unknown error" };
  }
}

export async function markAllAsRead(): Promise<{ success: boolean; error: string | null }> {
  try {
    await api.post(`/api/notifications/read-all`);
    return { success: true, error: null };
  } catch (error: unknown) {
    const err = error as { message?: string };
    return { success: false, error: err.message ?? "Unknown error" };
  }
}

export async function deleteNotification(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    await api.delete(`/api/notifications/${id}`);
    return { success: true, error: null };
  } catch (error: unknown) {
    const err = error as { message?: string };
    return { success: false, error: err.message ?? "Unknown error" };
  }
}
