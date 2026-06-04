import { ScanBarcode } from "lucide-react";
import Link from "next/link";

export function LogoIcon() {
  return (
    <div className="flex items-center gap-2 group">
      <div className="bg-primary p-1.5 rounded-lg text-white">
        <ScanBarcode className="h-5 w-5" />
      </div>
      <span className="text-xl font-extrabold tracking-tight text-foreground">
        Tracer<span className="text-primary">Pro</span>
      </span>
    </div>
  );
}
