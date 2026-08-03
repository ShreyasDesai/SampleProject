import type { Metadata } from "next";
import { ToolHeader } from "@/components/app/ToolHeader";
import { AuditLive } from "@/components/app/AuditLive";

export const metadata: Metadata = { title: "Site Audit" };

export default function Page() {
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/site-audit" />
      <AuditLive />
    </div>
  );
}
