import { getProjectDetail } from "@/actions/project.actions";
import { getAssets } from "@/actions/asset.actions";
import { getCategories } from "@/actions/category.actions";
import { getProjectActivities } from "@/actions/activity.actions";
import { notFound } from "next/navigation";
import ProjectDetailsView from "@/components/dashboard/project/project-details";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const { data: detail, error } = await getProjectDetail(projectId);

  if (error || !detail) {
    notFound();
  }

  const [assetsRes, categoriesRes, activitiesRes] = await Promise.all([
    getAssets(projectId, { page: 1, limit: 10 }),
    getCategories(projectId),
    getProjectActivities(projectId, 1, 10),
  ]);

  return (
    <ProjectDetailsView
      project={detail.project}
      stats={detail.stats}
      initialAssets={assetsRes.data}
      initialAssetsCount={assetsRes.count ?? 0}
      initialCategories={categoriesRes.data}
      initialActivities={activitiesRes.data ?? []}
      initialActivitiesTotalPages={activitiesRes.totalPages ?? 1}
    />
  );
}
