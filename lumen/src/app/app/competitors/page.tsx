import type { Metadata } from "next";
import { ToolHeader } from "@/components/app/ToolHeader";
import { CompetitorsLive } from "@/components/app/CompetitorsLive";

export const metadata: Metadata = { title: "Competitive Gap" };

export default function Page() {
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/competitors" />
      <CompetitorsLive />
    </div>
  );
}
