"use server";

import api from "@/lib/api";
import { revalidatePath } from "next/cache";
import type { AssetWithCategory } from "@/types";

interface ActionError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}

/**
 * Fetches paginated assets for a specific project.
 */
export async function getAssets(
  projectId: string,
  options: {
    search?: string;
  } = {}
) {
  try {
    const { search = "" } = options;
    const response = await api.get(`/api/projects/${projectId}/assets`, {
      params: { search },
    });
    
    return { 
      data: response.data.data as AssetWithCategory[], 
      count: response.data.data?.length || 0, 
      error: null 
    };
  } catch (error: unknown) {
    const err = error as ActionError;
    console.error("Error fetching assets from Laravel API:", error);
    return { data: [], count: 0, error: err.response?.data?.message || err.message || "An error occurred" };
  }
}

/**
 * Creates a new asset.
 */
export async function createAsset(formData: {
  projectId: string;
  categoryId: string;
  barcode: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>;
}) {
  try {
    const response = await api.post(`/api/projects/${formData.projectId}/assets`, {
      barcode: formData.barcode,
      category_id: formData.categoryId,
      values: formData.values,
    });
    
    revalidatePath(`/dashboard/projects/${formData.projectId}`);
    return { data: response.data as AssetWithCategory, error: null };
  } catch (error: unknown) {
    const err = error as ActionError;
    console.error("Error creating asset via Laravel API:", error);
    return { data: null, error: err.response?.data || err.message || "An error occurred" };
  }
}

/**
 * Updates an existing asset.
 */
export async function updateAsset(
  id: string,
  formData: {
    barcode: string;
    categoryId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Record<string, any>;
    projectId: string;
  }
) {
  try {
    const response = await api.patch(`/api/projects/${formData.projectId}/assets/${id}`, {
      barcode: formData.barcode,
      values: formData.values,
    });

    revalidatePath(`/dashboard/projects/${formData.projectId}`);
    return { data: response.data as AssetWithCategory, error: null };
  } catch (error: unknown) {
    const err = error as ActionError;
    console.error("Error updating asset via Laravel API:", error);
    return { data: null, error: err.response?.data || err.message || "An error occurred" };
  }
}

/**
 * Deletes an asset.
 */
export async function deleteAsset(id: string, projectId: string) {
  try {
    await api.delete(`/api/projects/${projectId}/assets/${id}`);
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { error: null };
  } catch (error: unknown) {
    const err = error as ActionError;
    console.error("Error deleting asset via Laravel API:", error);
    return { error: err.response?.data?.message || err.message || "An error occurred" };
  }
}

/**
 * Creates multiple assets in bulk.
 */
export async function bulkCreateAssets(
  projectId: string,
  categoryId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assets: { barcode: string; values: Record<string, any> }[]
) {
  try {
    const response = await api.post(`/api/projects/${projectId}/assets/import`, {
      category_id: categoryId,
      assets: assets.map((asset) => ({
        barcode: asset.barcode,
        values: asset.values || {},
      })),
    });
    
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { data: response.data, error: null };
  } catch (error: unknown) {
    const err = error as ActionError;
    console.error("Error bulk creating assets via Laravel API:", error);
    return { data: null, error: err.response?.data?.message || err.message || "An error occurred" };
  }
}
