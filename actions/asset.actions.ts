"use server";

import api from "@/lib/api";
import { revalidatePath } from "next/cache";
import type { Asset, AssetWithCategory } from "@/types";

/**
 * Fetches paginated assets for a specific project.
 */
export async function getAssets(
  projectId: string,
  options: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}
) {
  try {
    const { page = 1, limit = 10, search = "" } = options;
    const response = await api.get(`/api/projects/${projectId}/assets`, {
      params: { page, limit, search },
    });
    
    return { 
      data: response.data.data as AssetWithCategory[], 
      count: response.data.count || 0, 
      error: null 
    };
  } catch (error: any) {
    console.error("Error fetching assets from Laravel API:", error);
    return { data: [], count: 0, error: error.response?.data?.message || error.message };
  }
}

/**
 * Creates a new asset.
 */
export async function createAsset(formData: {
  projectId: string;
  categoryId: string;
  name: string;
  description?: string;
  values: Record<string, any>;
}) {
  try {
    const response = await api.post(`/api/projects/${formData.projectId}/assets`, {
      name: formData.name,
      description: formData.description || null,
      category_id: formData.categoryId,
      values: formData.values,
    });
    
    revalidatePath(`/dashboard/projects/${formData.projectId}`);
    return { data: response.data as AssetWithCategory, error: null };
  } catch (error: any) {
    console.error("Error creating asset via Laravel API:", error);
    return { data: null, error: error.response?.data?.message || error.message };
  }
}

/**
 * Updates an existing asset.
 */
export async function updateAsset(
  id: string,
  formData: {
    name: string;
    description?: string;
    categoryId: string;
    values: Record<string, any>;
    projectId: string;
  }
) {
  try {
    const response = await api.patch(`/api/projects/${formData.projectId}/assets/${id}`, {
      name: formData.name,
      description: formData.description || null,
      values: formData.values,
    });

    revalidatePath(`/dashboard/projects/${formData.projectId}`);
    return { data: response.data as AssetWithCategory, error: null };
  } catch (error: any) {
    console.error("Error updating asset via Laravel API:", error);
    return { data: null, error: error.response?.data?.message || error.message };
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
  } catch (error: any) {
    console.error("Error deleting asset via Laravel API:", error);
    return { error: error.response?.data?.message || error.message };
  }
}

/**
 * Creates multiple assets in bulk.
 */
export async function bulkCreateAssets(
  projectId: string,
  categoryId: string,
  assets: { name: string; description?: string; values: Record<string, any> }[]
) {
  try {
    const response = await api.post(`/api/projects/${projectId}/assets/import`, {
      category_id: categoryId,
      assets: assets.map((asset) => ({
        name: asset.name,
        description: asset.description || null,
        values: asset.values || {},
      })),
    });
    
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { data: response.data, error: null };
  } catch (error: any) {
    console.error("Error bulk creating assets via Laravel API:", error);
    return { data: null, error: error.response?.data?.message || error.message };
  }
}
