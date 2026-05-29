import { ProjectsGrid } from "@/components/dashboard/projects/projects-grid";
import { ProjectsHeader } from "@/components/dashboard/projects/projects-header";

const projects: Array<{
  id: string;
  name: string;
  description: string;
  status: "Active" | "Completed" | "On-Hold";
  progress: number;
  owner: string;
  assets: number;
  members: Array<{ id: string; avatar: string }>;
}> = [
  {
    id: "1",
    name: "Cloud Infrastructure Migration",
    description: "Scaling the core API services to multi-region AWS setup.",
    status: "Active",
    progress: 68,
    owner: "Sarah Jenkins",
    assets: 142,
    members: [
      { id: "1", avatar: "/avatars/1.png" },
      { id: "2", avatar: "/avatars/2.png" },
      { id: "3", avatar: "/avatars/3.png" },
      { id: "4", avatar: "/avatars/4.png" },
    ],
  },
];

export default function DashboardOverviewPage() {
  return (
    <>
      <ProjectsHeader />
      <ProjectsGrid projects={projects} />
    </>
  );
}
