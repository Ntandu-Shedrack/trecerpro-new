import { TableRow, TableCell } from "@/components/ui/table";
import { MoreVertical } from "lucide-react";

export type AssetRowProps = {
  assetId: string;
  name: string;
  serial: string;
  location?: string;
  user?: {
    name: string;
    avatar: string;
  };
  status: string;
  statusColor: string;
  lastAudit?: string;
  warranty?: string;
};

export function AssetRow({
  assetId,
  name,
  serial,
  location,
  user,
  status,
  statusColor,
  lastAudit,
  warranty,
}: AssetRowProps) {
  return (
    <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
      <TableCell className="px-6 py-4 font-mono font-medium text-primary">
        {assetId}
      </TableCell>

      <TableCell className="px-6 py-4">
        <div className="font-semibold text-slate-900 dark:text-slate-200">
          {name}
        </div>
        <div className="text-xs text-slate-500">SN: {serial}</div>
      </TableCell>

      {location && <TableCell className="px-6 py-4">{location}</TableCell>}

      {user && (
        <TableCell className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <img src={user.avatar} alt={user.name} />
            </div>
            <span>{user.name}</span>
          </div>
        </TableCell>
      )}

      <TableCell className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
        >
          <span className="size-1.5 rounded-full bg-current"></span>
          {status}
        </span>
      </TableCell>

      {lastAudit && (
        <TableCell className="px-6 py-4 text-slate-500">{lastAudit}</TableCell>
      )}

      {warranty && (
        <TableCell className="px-6 py-4 text-slate-500">{warranty}</TableCell>
      )}

      <TableCell className="px-6 py-4 text-right">
        <button className="text-slate-400 hover:text-primary">
          <MoreVertical size={18} />
        </button>
      </TableCell>
    </TableRow>
  );
}
