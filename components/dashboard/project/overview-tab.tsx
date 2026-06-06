import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Layers, Tags, BarChart3, ArrowUpRight, Info, History, Calendar, Clock, ChevronRight, Package } from 'lucide-react'
import { format } from 'date-fns'
import type { Project } from '@/types'

interface OverviewTabProps {
  project: Project;
  stats: {
    assetCount: number;
    categoryCount: number;
  };
}

export default function OverviewTab({ project, stats }: OverviewTabProps) {
  const statItems = [
    { label: "Categories", value: stats.categoryCount.toString(), icon: Tags, color: "text-primary" },
    { label: "Assets", value: stats.assetCount.toString(), icon: Layers, color: "text-purple-500" },
    { label: "Stability", value: "98%", icon: BarChart3, color: "text-emerald-500" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Stats Cards */}
      <div className="md:col-span-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statItems.map((stat) => (
            <Card key={stat.label} className="bg-card/75 border-border/80 hover:border-primary/20 transition-all duration-300 group overflow-hidden relative rounded-2xl">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  {stat.label}
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  No change this week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {stats.assetCount === 0 ? (
          <Card className="bg-card/75 border-border/80 h-[320px] flex items-center justify-center border-dashed relative overflow-hidden group rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
            <div className="text-center space-y-4 max-w-sm px-6 relative z-10 transition-transform group-hover:scale-[1.02]">
              <div className="h-16 w-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Layers className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-foreground">No Assets in Project</h3>
                <p className="text-sm text-muted-foreground">Start tracking your physical or digital assets by adding your first entry below.</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2 font-semibold border-border/80 text-foreground bg-transparent hover:bg-muted/10 cursor-pointer">
                Add First Asset
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="bg-card/75 border-border/80 h-[320px] flex flex-col items-center justify-center relative overflow-hidden group rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
            <div className="text-center space-y-4 max-w-sm px-6 relative z-10">
              <div className="h-16 w-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-foreground">{stats.assetCount} Assets Tracked</h3>
                <p className="text-sm text-muted-foreground">Your project assets are being tracked and monitored. View the Assets tab for details.</p>
              </div>
              <Button size="sm" className="mt-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(19,127,236,0.3)] border-none cursor-pointer">
                View All Assets
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Sidebar Info */}
      <div className="md:col-span-4 flex flex-col gap-6">
        <Card className="bg-card/75 border-border/80 p-5 rounded-2xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Info className="h-3 w-3 text-primary" />
            PROJECT METADATA
          </h4>
          <Separator className="bg-border/40 mb-4" />
          <div className="space-y-4 text-sm text-foreground">
            <div className="flex justify-between items-center group cursor-default">
              <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Created</span>
              <span className="font-medium group-hover:text-primary transition-colors">{format(new Date(project.created_at), "MMM d, yyyy")}</span>
            </div>
            <div className="flex justify-between items-center group cursor-default">
              <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Updated</span>
              <span className="font-medium group-hover:text-primary transition-colors">{format(new Date(project.updated_at), "MMM d, yyyy")}</span>
            </div>
            <Separator className="bg-border/40" />
            <div className="grid grid-cols-1 gap-1.5 py-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">PROJECT REFERENCE ID</span>
              <div className="text-[11px] bg-muted/40 p-2.5 rounded-lg border border-border/80 text-muted-foreground select-all font-mono tracking-tight">
                {project.id}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-card/75 border-border/80 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-primary/10 opacity-30 group-hover:scale-105 transition-transform">
            <History className="h-14 w-14" />
          </div>
          <h4 className="text-sm font-semibold text-foreground mb-2">View History</h4>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed max-w-[85%]">Check the complete audit trail and activity log for this project since creation.</p>
          <Button variant="link" size="sm" className="p-0 text-primary hover:text-primary/80 h-auto font-bold text-xs uppercase tracking-wider group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1.5 cursor-pointer">
            OPEN AUDIT LOG <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Card>
      </div>
    </div>
  )
}