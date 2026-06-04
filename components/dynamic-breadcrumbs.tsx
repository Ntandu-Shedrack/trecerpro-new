"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { getProjectById } from "@/actions/project.actions";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbConfig = {
  label?: string;
  hide?: boolean;
};

type Props = {
  homeLabel?: string;
  labelMap?: Record<string, string>;
  configMap?: Record<string, BreadcrumbConfig>;
  className?: string;
};

export function DynamicBreadcrumbs({
  homeLabel = "TracerPro",
  labelMap = {},
  configMap = {},
  className,
}: Props) {
  const pathname = usePathname();
  const [resolvedLabels, setResolvedLabels] = useState<Record<string, string>>({});

  // Split path into segments
  const segments = pathname.split("/").filter(Boolean);

  useEffect(() => {
    const fetchLabels = async () => {
      const newLabels: Record<string, string> = {};
      let changed = false;

      for (let i = 0; i < segments.length; i++) {
        // If the previous segment was "projects", we assume this is a projectId
        if (segments[i - 1] === "projects" && segments[i]) {
          const projectId = segments[i];
          if (!resolvedLabels[projectId]) {
            try {
              const { data } = await getProjectById(projectId);
              if (data?.name) {
                newLabels[projectId] = data.name;
                changed = true;
              }
            } catch (err) {
              console.error("Failed to fetch project name for breadcrumb", err);
            }
          }
        }
      }

      if (changed) {
        setResolvedLabels((prev) => ({ ...prev, ...newLabels }));
      }
    };

    fetchLabels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Build breadcrumb items
  const breadcrumbs = segments
    .map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");

      const formatted = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      const config = configMap[segment];

      return {
        href,
        label: resolvedLabels[segment] || config?.label || labelMap[segment] || formatted,
        hide: config?.hide || false,
      };
    })
    .filter((crumb) => !crumb.hide);

  // Optionally hide breadcrumbs on root
  if (pathname === "/") return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">{homeLabel}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
