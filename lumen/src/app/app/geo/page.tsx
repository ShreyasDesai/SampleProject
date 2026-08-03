import type { Metadata } from "next";
import { ToolHeader } from "@/components/app/ToolHeader";
import { GeoAioLive } from "@/components/app/GeoAioLive";

export const metadata: Metadata = { title: "GEO Visibility" };

export default function Page() {
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/geo" />
      <GeoAioLive mode="geo" />
    </div>
  );
}
