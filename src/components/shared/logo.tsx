import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 group", className)}>
      <div className="relative h-9 w-9 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
        <span className="font-display font-extrabold text-navy-900 text-lg">C</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-gold opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-display font-bold text-base tracking-tight">CodeNative</span>
        <span className="text-[10px] text-white/40 uppercase tracking-widest">learn in your tongue</span>
      </div>
    </Link>
  );
}
