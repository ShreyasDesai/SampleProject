import type { Metadata } from "next";
import { ToolHeader } from "@/components/app/ToolHeader";
import { SiteExplorerLive } from "@/components/app/SiteExplorerLive";

export const metadata: Metadata = { title: "Site Explorer" };

export default function Page() {
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/site-explorer" />
      <SiteExplorerLive />
    </div>
  );
}
