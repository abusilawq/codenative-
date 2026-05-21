import { Navbar } from "@/components/landing/navbar";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <Navbar />
      <main className={cn("container relative pt-20 sm:pt-24 pb-28 md:pb-16", className)}>{children}</main>
    </div>
  );
}
