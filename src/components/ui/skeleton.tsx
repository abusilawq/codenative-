import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/[0.06] bg-gradient-to-r from-white/[0.03] via-white/[0.08] to-white/[0.03] bg-[length:200%_100%]",
        className
      )}
      style={{ animation: "shimmer 2s linear infinite" }}
      {...props}
    />
  );
}

export { Skeleton };
