import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderGit2, Tags, Package } from "lucide-react";

interface StatCardsProps {
  data: {
    projectCount: number;
    categoryCount: number;
    assetCount: number;
  };
}

export function StatCards({ data }: StatCardsProps) {
  const stats = [
    {
      title: "Total Projects",
      value: data.projectCount,
      icon: FolderGit2,
      description: "Active initiatives",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "group-hover:border-blue-500/50",
      glowColor: "group-hover:shadow-blue-500/10",
    },
    {
      title: "Asset Categories",
      value: data.categoryCount,
      icon: Tags,
      description: "Template structures",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "group-hover:border-purple-500/50",
      glowColor: "group-hover:shadow-purple-500/10",
    },
    {
      title: "Total Assets",
      value: data.assetCount,
      icon: Package,
      description: "Tracked inventory",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "group-hover:border-emerald-500/50",
      glowColor: "group-hover:shadow-emerald-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${stat.borderColor} ${stat.glowColor} border-muted/60`}
        >
          {/* Subtle Background Glow */}
          <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${stat.bgColor} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`} />

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {stat.title}
            </CardTitle>
            <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color} ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-extrabold tracking-tighter tabular-nums leading-none">
                {stat.value}
              </div>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground/80 mt-2 flex items-center gap-1.5 uppercase tracking-wider">
              <span className={`h-1.5 w-1.5 rounded-full ${stat.color.replace('text', 'bg')}`} />
              {stat.description}
            </p>
          </CardContent>

          {/* Bottom Progress Line Decoration */}
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transition-all duration-700 group-hover:w-full" style={{ color: `var(--${stat.color.split('-')[1]}-500)` }} />
        </Card>
      ))}
    </div>
  );
}

