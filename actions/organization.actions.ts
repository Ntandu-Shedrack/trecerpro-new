"use server";

import api from "@/lib/api";
import { revalidatePath } from "next/cache";
import type { OrgInvitation, OrgMember, Organization } from "@/types";
import { cookies } from "next/headers";
import { extractAuthToken } from "@/lib/auth/api-proxy";

function orgPath(organizationId: string, suffix = "") {
  return `/api/organizations/${organizationId}${suffix}`;
}

export async function updateOrganization(
  organizationId: string,
  data: { name: string; slug?: string }
) {
  try {
    const response = await api.patch(orgPath(organizationId), data);
    revalidatePath("/dashboard/settings/organization");
    return { data: response.data, error: null };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      data: null,
      error: err.response?.data?.message || err.message || "Failed to update organization",
    };
  }
}

export async function uploadOrganizationLogo(
  organizationId: string,
  formData: FormData
) {
  try {
    const response = await api.post(orgPath(organizationId, "/logo"), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    revalidatePath("/dashboard/settings/organization");
    return { data: response.data, error: null };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      data: null,
      error: err.response?.data?.message || err.message || "Failed to upload logo",
    };
  }
}

export async function getOrganizationMembers(organizationId: string) {
  try {
    const response = await api.get(orgPath(organizationId, "/members"));
    return {
      data: (response.data.data ?? response.data) as OrgMember[],
      error: null,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return { data: [] as OrgMember[], error: err.response?.data?.message || err.message };
  }
}

export async function getOrganizationInvitations(organizationId: string) {
  try {
    const response = await api.get(orgPath(organizationId, "/invitations"));
    return {
      data: (response.data.data ?? response.data) as OrgInvitation[],
      error: null,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return { data: [] as OrgInvitation[], error: err.response?.data?.message || err.message };
  }
}

export async function inviteOrganizationMember(
  organizationId: string,
  email: string,
  role: "org:member" | "org:admin"
) {
  try {
    const laravelRole = role === "org:admin" ? "admin" : "member";
    const response = await api.post(orgPath(organizationId, "/invitations"), {
      email,
      role: laravelRole,
    });
    revalidatePath("/dashboard/settings/organization");
    return { data: response.data, error: null };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return { data: null, error: err.response?.data?.message || err.message };
  }
}

export async function removeOrganizationMember(
  organizationId: string,
  membershipId: string
) {
  try {
    await api.delete(orgPath(organizationId, `/members/${membershipId}`));
    revalidatePath("/dashboard/settings/organization");
    return { error: null };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return { error: err.response?.data?.message || err.message };
  }
}

export async function updateOrganizationMemberRole(
  organizationId: string,
  membershipId: string,
  role: string
) {
  try {
    const laravelRole = role === "org:admin" ? "admin" : "member";
    await api.patch(orgPath(organizationId, `/members/${membershipId}`), {
      role: laravelRole,
    });
    revalidatePath("/dashboard/settings/organization");
    return { error: null };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return { error: err.response?.data?.message || err.message };
  }
}

export async function revokeOrganizationInvitation(
  organizationId: string,
  invitationId: string
) {
  try {
    await api.delete(orgPath(organizationId, `/invitations/${invitationId}`));
    revalidatePath("/dashboard/settings/organization");
    return { error: null };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return { error: err.response?.data?.message || err.message };
  }
}

export async function leaveOrganization(organizationId: string) {
  try {
    await api.post(orgPath(organizationId, "/leave"));
    revalidatePath("/dashboard");
    return { error: null };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return { error: err.response?.data?.message || err.message };
  }
}

export async function deleteOrganization(organizationId: string) {
  try {
    await api.delete(orgPath(organizationId));
    revalidatePath("/dashboard");
    return { error: null };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return { error: err.response?.data?.message || err.message };
  }
}

export async function getInvitationContext(token: string) {
  try {
    const response = await api.get(`/api/invitations/${token}`);
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error: error.response?.data?.message || error.message };
  }
}

export async function acceptInvitation(token: string, registrationData?: any) {
  try {
    const response = await api.post(`/api/invitations/${token}/accept`, registrationData || {});
    const data = response.data;
    
    // Extract token if login/register occurred
    const authToken = extractAuthToken(data);
    const user = data.user;
    const cookieStore = await cookies();

    if (authToken) {
      cookieStore.set("auth_token", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    const activeOrgId = user?.current_organization?.id || user?.currentOrganization?.id || (user?.organizations && user?.organizations[0]?.id);
    if (activeOrgId) {
      cookieStore.set("active_organization_id", String(activeOrgId), {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    } else {
      // Fallback: If organization object is directly returned
      const directOrgId = data.organization?.id || data.organization_id || data.invitation?.organization_id;
      if (directOrgId) {
        cookieStore.set("active_organization_id", String(directOrgId), {
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });
      }
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.response?.data?.message || error.message };
  }
}

export async function getSuggestedOrganizations() {
  try {
    const response = await api.get("/api/organizations/suggested");
    return { data: response.data as Organization[], error: null };
  } catch (error: any) {
    return { data: [] as Organization[], error: error.response?.data?.message || error.message };
  }
}

export async function joinOrganization(organizationId: string) {
  try {
    const response = await api.post(`/api/organizations/${organizationId}/join`);
    const cookieStore = await cookies();
    cookieStore.set("active_organization_id", String(organizationId), {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    revalidatePath("/dashboard");
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error: error.response?.data?.message || error.message };
  }
}
