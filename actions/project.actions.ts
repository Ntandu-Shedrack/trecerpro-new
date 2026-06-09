"use server";

import api from "@/lib/api";
import { revalidatePath } from "next/cache";
import type { Project, ProjectStatus } from "@/types";

export async function getProjectDetail(projectId: string) {
  try {
    const response = await api.get(`/api/projects/${projectId}`);
    const project = response.data.data ?? response.data;
    return {
      data: {
        project: project as Project,
        stats: {
          assetCount: project?.assets_count ?? 0,
          categoryCount: project?.categories_count ?? 0,
        },
      },
      error: null,
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error("Error fetching project from Laravel API:", error);
    return { data: null, error: err.response?.data?.message || err.message };
  }
}

export async function getProjects(organizationId: string) {
  try {
    const response = await api.get("/api/projects");
    const projects = Array.isArray(response.data) ? response.data : (response.data.data ?? []);
    return { data: projects as Project[], error: null };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error("Error fetching projects from Laravel API:", error);
    return { data: [], error: err.response?.data?.message || err.message };
  }
}

/** @deprecated Use getProjectDetail */
export async function getProjectById(projectId: string) {
  const { data, error } = await getProjectDetail(projectId);
  return { data: data?.project ?? null, error };
}

/** @deprecated Use getProjectDetail */
export async function getProjectStats(projectId: string) {
  const { data, error } = await getProjectDetail(projectId);
  return {
    data: data?.stats ?? { assetCount: 0, categoryCount: 0 },
    error,
  };
}

export async function createProject(formData: {
  name: string;
  description?: string;
  status?: string;
  organizationId: string;
}) {
  try {
    const response = await api.post(
      "/api/projects",
      {
        name: formData.name,
        description: formData.description || null,
        status: formData.status || "active",
      }
    );
    revalidatePath("/dashboard");
    const project = response.data.data ?? response.data;
    return { data: project as Project, error: null };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error("Error creating project via Laravel API:", error);
    return { data: null, error: err.response?.data?.message || err.message };
  }
}

export async function deleteProject(projectId: string) {
  try {
    await api.delete(`/api/projects/${projectId}`);
    revalidatePath("/dashboard");
    return { error: null };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error("Error deleting project via Laravel API:", error);
    return { error: err.response?.data?.message || err.message };
  }
}

export async function updateProject(
  projectId: string,
  formData: { name: string; description?: string; status?: string }
) {
  try {
    const response = await api.patch(`/api/projects/${projectId}`, {
      name: formData.name,
      description: formData.description || null,
      status: formData.status || null,
    });
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { data: response.data as Project, error: null };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error("Error updating project via Laravel API:", error);
    return { data: null, error: err.response?.data?.message || err.message };
  }
}
