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
    { label: "Categories", value: stats.categoryCount.toString(), icon: Tags, color: "text-blue-500" },
    { label: "Assets", value: stats.assetCount.toString(), icon: Layers, color: "text-purple-500" },
    { label: "Stability", value: "98%", icon: BarChart3, color: "text-emerald-500" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Stats Cards */}
                  <div className="md:col-span-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {statItems.map((stat) => (
                        <Card key={stat.label} className="bg-card/50 border-border/50 hover:border-primary/20 transition-all group overflow-hidden relative">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                           <CardHeader className="pb-2">
                             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                               {stat.label}
                               <stat.icon className={`h-4 w-4 ${stat.color}`} />
                             </CardTitle>
                           </CardHeader>
                           <CardContent>
                             <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                             <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                               <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                               No change this week
                             </p>
                           </CardContent>
                        </Card>
                      ))}
                    </div>

                    {stats.assetCount === 0 ? (
                      <Card className="bg-card/50 border-border/50 h-[320px] flex items-center justify-center border-dashed relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                         <div className="text-center space-y-4 max-w-sm px-6 relative z-10 transition-transform group-hover:scale-[1.02]">
                            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto ring-8 ring-muted/20">
                              <Layers className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">No Assets in Project</h3>
                              <p className="text-sm text-muted-foreground">Start tracking your physical or digital assets by adding your first entry below.</p>
                            </div>
                            <Button variant="outline" size="sm" className="mt-2 font-semibold">
                              Add First Asset
                            </Button>
                         </div>
                      </Card>
                    ) : (
                      <Card className="bg-card/50 border-border/50 h-[320px] flex flex-col items-center justify-center relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                         <div className="text-center space-y-4 max-w-sm px-6 relative z-10">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-primary/5">
                              <Package className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">{stats.assetCount} Assets Tracked</h3>
                              <p className="text-sm text-muted-foreground">Your project assets are being tracked and monitored. View the Assets tab for details.</p>
                            </div>
                            <Button variant="default" size="sm" className="mt-2 font-semibold">
                              View All Assets
                            </Button>
                         </div>
                      </Card>
                    )}
                  </div>

                  {/* Sidebar Info */}
                  <div className="md:col-span-4 flex flex-col gap-6">
                    <Card className="bg-muted/30 border-none shadow-none p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                        <Info className="h-3 w-3" />
                        Project Metadata
                      </h4>
                      <Separator className="bg-border/50 mb-4" />
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center group cursor-default">
                          <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Created</span>
                          <span className="font-medium group-hover:text-primary transition-colors">{format(new Date(project.created_at), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex justify-between items-center group cursor-default">
                          <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Updated</span>
                          <span className="font-medium group-hover:text-primary transition-colors">{format(new Date(project.updated_at), "MMM d, yyyy")}</span>
                        </div>
                        <Separator className="bg-border/50" />
                        <div className="grid grid-cols-1 gap-1.5 py-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Project Reference ID</span>
                          <code className="text-[11px] bg-muted/80 p-1.5 rounded-md border text-muted-foreground select-all transition-all hover:bg-muted font-mono">{project.id}</code>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden group cursor-pointer hover:bg-primary/10 transition-colors">
                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <History className="h-12 w-12" />
                      </div>
                      <h4 className="text-sm font-semibold mb-2">View History</h4>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Check the complete audit trail and activity log for this project since creation.</p>
                      <Button variant="link" size="sm" className="p-0 text-primary h-auto font-bold text-xs uppercase tracking-tight group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Open Audit Log <ChevronRight className="h-3 w-3" />
                      </Button>
                    </Card>
                  </div>
                </div>
  )
}