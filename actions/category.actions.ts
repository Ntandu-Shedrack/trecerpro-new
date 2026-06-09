"use server";

import api from "@/lib/api";
import { revalidatePath } from "next/cache";
import type { Attribute, AttributeType, Category } from "@/types";

/**
 * Fetches all categories for a specific project.
 */
export async function getCategories(projectId: string) {
  try {
    const response = await api.get(`/api/projects/${projectId}/categories`);
    const data = Array.isArray(response.data)
      ? response.data
      : (Array.isArray(response.data?.data) ? response.data.data : []);
    return { data: data as Category[], error: null };
  } catch (error: any) {
    console.error("Error fetching categories from Laravel API:", error);
    return { data: [], error: error.response?.data?.message || error.message };
  }
}

/**
 * Creates a new asset category.
 */
export async function createCategory(formData: {
  projectId: string;
  name: string;
  description?: string;
  attributes: Attribute[];
}) {
  try {
    const response = await api.post(`/api/projects/${formData.projectId}/categories`, {
      name: formData.name,
      description: formData.description || null,
      attributes: formData.attributes,
    });
    
    revalidatePath(`/dashboard/projects/${formData.projectId}`);
    return { data: response.data as Category, error: null };
  } catch (error: any) {
    console.error("Error creating category via Laravel API:", error);
    return { data: null, error: error.response?.data?.message || error.message };
  }
}

/**
 * Updates an existing asset category.
 */
export async function updateCategory(id: string, formData: {
  name: string;
  description?: string;
  attributes: Attribute[];
  projectId: string;
}) {
  try {
    const response = await api.patch(`/api/projects/${formData.projectId}/categories/${id}`, {
      name: formData.name,
      description: formData.description || null,
      attributes: formData.attributes,
    });

    revalidatePath(`/dashboard/projects/${formData.projectId}`);
    return { data: response.data as Category, error: null };
  } catch (error: any) {
    console.error("Error updating category via Laravel API:", error);
    return { data: null, error: error.response?.data?.message || error.message };
  }
}

/**
 * Deletes an asset category.
 */
export async function deleteCategory(id: string, projectId: string) {
  try {
    await api.delete(`/api/projects/${projectId}/categories/${id}`);
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting category via Laravel API:", error);
    return { error: error.response?.data?.message || error.message };
  }
}
