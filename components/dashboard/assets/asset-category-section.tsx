import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
} from "@/components/ui/table";

import { ChevronRight, ChevronDown, LucideIcon } from "lucide-react";
import { AssetRow, AssetRowProps } from "./asset-row";

type Asset = Record<string, unknown>;

type CategoryProps = {
  title: string;
  Icon?: LucideIcon;
  color: string;
  count: number;
  value: string;
  columns: string[];
  assets: AssetRowProps[];
  collapsed?: boolean;
};

export function AssetCategorySection({
  title,
  Icon,
  color,
  count,
  value,
  columns,
  assets,
  collapsed = false,
}: CategoryProps) {
  return (
    <section className="flex flex-col p-8">
      {/* Category Header */}

      <div
        className={`flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800 ${
          collapsed ? "rounded-xl" : "rounded-t-xl"
        } group`}
      >
        <div className="flex items-center gap-3">
          {collapsed ? (
            <ChevronRight
              size={18}
              className="text-slate-400 group-hover:text-primary cursor-pointer"
            />
          ) : (
            <ChevronDown
              size={18}
              className="text-slate-400 group-hover:text-primary cursor-pointer"
            />
          )}

          {/* Icon */}
          <div
            className={`size-8 ${color} rounded-lg flex items-center justify-center`}
          >
            {Icon && <Icon size={18} />}
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>

          <span className="px-2 py-0.5 text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
            {count} Assets
          </span>
        </div>

        <div className="text-sm text-slate-500">Value: {value}</div>
      </div>

      {!collapsed && (
        <div className="overflow-x-auto border-x border-b border-slate-200 dark:border-slate-800 rounded-b-xl bg-white dark:bg-slate-950">
          <Table className="text-sm">
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col} className="px-6 py-3">
                    {col}
                  </TableHead>
                ))}

                <TableHead className="px-6 py-3 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
              {assets.map((asset, index) => (
                <AssetRow key={(asset as any)?.id ?? index} {...asset} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
