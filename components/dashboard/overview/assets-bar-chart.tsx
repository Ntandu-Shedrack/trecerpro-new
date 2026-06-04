"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AssetsBarChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

export function AssetsBarChart({ data }: AssetsBarChartProps) {
  return (
    <Card className="col-span-1 overflow-hidden group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Asset Growth
            </CardTitle>
            <CardDescription className="mt-1">
              Monthly overview of assets created in {new Date().getFullYear()}
            </CardDescription>
          </div>
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20V16" />
            </svg>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="hsl(var(--muted-foreground))"
                opacity={0.05}
              />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--foreground))"
                fontSize={11}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="hsl(var(--foreground))"
                fontSize={11}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--primary))", opacity: 0.05, radius: 4 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border bg-background/95 backdrop-blur-md p-3 shadow-xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
                            {payload[0].payload.name} {new Date().getFullYear()}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-sm font-bold tracking-tight">
                              {payload[0].value} New Assets
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="total"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                barSize={32}
                animationDuration={1500}
                animationEasing="ease-in-out"
                activeBar={{
                  fill: "hsl(var(--primary))",
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 1,
                  filter: "drop-shadow(0px 0px 8px hsl(var(--primary) / 0.5))"
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

