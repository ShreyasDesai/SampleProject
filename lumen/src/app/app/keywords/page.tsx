import type { Metadata } from "next";
import { ToolHeader } from "@/components/app/ToolHeader";
import { KeywordsLive } from "@/components/app/KeywordsLive";

export const metadata: Metadata = { title: "Keywords Explorer" };

export default function Page() {
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/keywords" />
      <KeywordsLive />
    </div>
  );
}
