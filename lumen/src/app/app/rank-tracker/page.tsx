import type { Metadata } from "next";
import { ToolHeader } from "@/components/app/ToolHeader";
import { RankTrackerLive } from "@/components/app/RankTrackerLive";

export const metadata: Metadata = { title: "Rank Tracker" };

export default function Page() {
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/rank-tracker" />
      <RankTrackerLive />
    </div>
  );
}
