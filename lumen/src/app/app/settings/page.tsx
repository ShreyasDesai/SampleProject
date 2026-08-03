import type { Metadata } from "next";
import { ToolHeader } from "@/components/app/ToolHeader";
import { SettingsLive } from "@/components/app/SettingsLive";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/settings" />
      <SettingsLive />
    </div>
  );
}
