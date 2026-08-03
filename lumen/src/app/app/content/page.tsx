import type { Metadata } from "next";
import { ToolHeader } from "@/components/app/ToolHeader";
import { ContentLive } from "@/components/app/ContentLive";

export const metadata: Metadata = { title: "Content Lab" };

export default function Page() {
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/content" />
      <ContentLive />
    </div>
  );
}
