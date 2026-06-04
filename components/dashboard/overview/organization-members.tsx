import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { getDashboardMembers } from "@/actions/overview.actions";

interface OrganizationMembersProps {
  organizationId: string;
}

export async function OrganizationMembers({
  organizationId,
}: OrganizationMembersProps) {
  const { data: members } = await getDashboardMembers(organizationId);

  return (
    <Card className="h-full overflow-hidden border-muted/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/5 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold tracking-tight">
            Team Members
          </CardTitle>
          <CardDescription className="text-xs">
            {members.length} active collaborators
          </CardDescription>
        </div>
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
          <Users className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-5">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between group cursor-default"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarImage src={member.imageUrl} />
                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                    {member.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-tight">
                    {member.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground/70 truncate max-w-[140px] font-medium">
                    {member.email}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="capitalize text-[10px] font-bold px-2 py-0 h-5">
                {member.role}
              </Badge>
            </div>
          ))}
          {members.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-6 w-6 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No members found
              </p>
            </div>
          )}
        </div>
        {members.length > 0 && (
          <div className="mt-8 pt-4 border-t border-muted/40">
            <Link
              href="/dashboard/settings/organization"
              className="w-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center justify-center gap-2"
            >
              Manage Organization
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
