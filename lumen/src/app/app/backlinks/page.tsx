import type { Metadata } from "next";
import { ToolHeader } from "@/components/app/ToolHeader";
import { BacklinksLive } from "@/components/app/BacklinksLive";

export const metadata: Metadata = { title: "Backlink Profile" };

export default function Page() {
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/backlinks" />
      <BacklinksLive />
    </div>
  );
}
