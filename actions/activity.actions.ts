"use server";

import api from "@/lib/api";
import type { Activity } from "@/types";

export interface ActivityInput {
  projectId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  entityName?: string;
  details?: Record<string, unknown>;
}

export async function logActivity(_input: ActivityInput) {
  return { success: true };
}

export async function getProjectActivities(projectId: string) {
  try {
    const response = await api.get(`/api/projects/${projectId}/activities`);

    return {
      data: response.data.data as Activity[],
      count: response.data.data?.length || 0,
      error: null,
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error("Error fetching activities from Laravel API:", error);
    return {
      data: [] as Activity[],
      count: 0,
      error: err.response?.data?.message || err.message,
    };
  }
}
