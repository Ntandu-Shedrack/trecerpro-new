import { getProjects } from "@/actions/project.actions";
import { getSession } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProjectsView } from "@/components/dashboard/projects/projects-view";

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  let orgId = cookieStore.get("active_organization_id")?.value;

  if (!orgId) {
    const session = await getSession();
    orgId = session.orgId ?? undefined;
  }

  if (!orgId) {
    redirect("/onboarding");
  }

  const { data: projects } = await getProjects(orgId);

  return <ProjectsView initialProjects={projects || []} organizationId={orgId} />;
}
