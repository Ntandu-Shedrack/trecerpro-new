import { AssetListHeader } from "@/components/dashboard/assets/assets-list-header";
import { GroupedAssetsTable } from "@/components/dashboard/assets/grouped-assets-table";

export default function AssetsListPage() {
  return (
    <>
      <AssetListHeader />
      <GroupedAssetsTable
        categories={[
          {
            title: "Server Infrastructure",
            icon: "dns",
            color: "bg-primary/10 text-primary",
            count: 12,
            value: "$245,000.00",
            columns: [
              "Asset ID",
              "Model/Name",
              "Location",
              "Status",
              "Last Audit",
            ],
            assets: [
              {
                assetId: "SRV-0042",
                name: "Dell PowerEdge R750",
                serial: "DE-991204X",
                location: "DC-East / Rack 12A",
                status: "Operational",
                statusColor:
                  "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
                lastAudit: "Oct 12, 2023",
              },
            ],
          },
          {
            title: "Infrastructure",
            icon: "dns",
            color: "bg-primary/10 text-primary",
            count: 12,
            value: "$245,000.00",
            columns: [
              "Asset ID",
              "Model/Name",
              "Location",
              "Status",
              "Last Audit",
            ],
            assets: [
              {
                assetId: "SRV-0042",
                name: "Dell PowerEdge R750",
                serial: "DE-991204X",
                location: "DC-East / Rack 12A",
                status: "Operational",
                statusColor:
                  "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
                lastAudit: "Oct 12, 2023",
              },
            ],
          },
        ]}
      />
    </>
  );
}
