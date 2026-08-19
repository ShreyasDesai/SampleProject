import Link from "next/link";
import { MapPin } from "lucide-react";

export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          light ? "bg-coral-500 text-white" : "bg-ink-900 text-sand-50"
        }`}
      >
        <MapPin className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span
        className={`font-display text-xl font-semibold tracking-tight ${
          light ? "text-white" : "text-ink-950"
        }`}
      >
        NearReach
      </span>
    </Link>
  );
}
