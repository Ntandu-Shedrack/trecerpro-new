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

export async function getProjectActivities(
  projectId: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const response = await api.get(`/api/projects/${projectId}/activities`, {
      params: { page, limit },
    });

    return {
      data: response.data.data as Activity[],
      count: response.data.totalPages * limit,
      totalPages: response.data.totalPages || 0,
      currentPage: page,
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
      totalPages: 0,
      currentPage: page,
      error: err.response?.data?.message || err.message,
    };
  }
}
