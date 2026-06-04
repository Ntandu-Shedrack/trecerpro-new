import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";
export default function AssetTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="border-border/40">
          <TableCell className="py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-3 w-[120px]" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24 rounded-full" />
          </TableCell>
          <TableCell>
            <div className="space-y-2">
               <Skeleton className="h-3 w-32" />
               <Skeleton className="h-2 w-16" />
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-9 w-9 rounded-full ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}