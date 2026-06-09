"use client";

import { useCurrentOrganization } from "@/context/auth-context";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload, Building2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  updateOrganization,
  uploadOrganizationLogo,
} from "@/actions/organization.actions";
import { useRouter } from "next/navigation";

export default function GeneralTab() {
  const { organization, isLoaded } = useCurrentOrganization();
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (organization) {
      setName(organization.name ?? "");
      setSlug(organization.slug ?? "");
    }
  }, [organization]);

  if (!isLoaded || !organization) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateOrganization(organization.id, {
      name,
      slug: slug || undefined,
    });
    if (error) {
      toast.error(error);
    } else {
      toast.success("Organization updated successfully");
      router.refresh();
    }
    setSaving(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("logo", file);
    const { error } = await uploadOrganizationLogo(organization.id, formData);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Logo updated");
      router.refresh();
    }
    setUploadingLogo(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const currentName = organization.name ?? "";
  const currentSlug = organization.slug ?? "";
  const isDirty = name !== currentName || slug !== currentSlug;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization Logo</CardTitle>
          <CardDescription>
            Upload a logo to represent your organization across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-muted">
              {organization.imageUrl ? (
                <Image
                  src={organization.imageUrl}
                  alt={organization.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Building2 className="h-7 w-7 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <input
                ref={fileRef}
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => fileRef.current?.click()}
                disabled={uploadingLogo}
              >
                {uploadingLogo ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                {uploadingLogo ? "Uploading…" : "Upload logo"}
              </Button>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, or SVG. Recommended 256×256px.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization Details</CardTitle>
          <CardDescription>
            Update your organization&apos;s name and URL slug.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="org-name">Name</Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org-slug">Slug</Label>
            <div className="flex items-center gap-0">
              <span className="inline-flex h-9 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                app.tracerpro.io/
              </span>
              <Input
                id="org-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="acme-corp"
                className="rounded-l-none"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Lowercase letters, numbers, and hyphens only.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 justify-end gap-2">
          <Button
            className="mr-auto"
            variant="ghost"
            size="sm"
            disabled={!isDirty || saving}
            onClick={() => {
              setName(organization.name ?? "");
              setSlug(organization.slug ?? "");
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!isDirty || saving}
            onClick={handleSave}
            className="gap-2"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
