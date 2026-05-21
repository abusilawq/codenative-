"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/landing/mobile-nav";
import { Code2, BookOpen, GitBranch, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/explain", label: "Explain", icon: Code2 },
  { href: "/story", label: "Story", icon: BookOpen },
  { href: "/repo", label: "RepoGuide", icon: GitBranch },
  { href: "/learn", label: "Daily", icon: Flame },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-navy-900/70 backdrop-blur-xl"
      >
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors",
                    active ? "text-gold-400" : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 bg-gold-500/10 rounded-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/explain">Get started</Link>
            </Button>
            <Button asChild size="sm" className="sm:hidden">
              <Link href="/explain">Start</Link>
            </Button>
          </div>
        </div>
      </motion.header>
      <MobileNav />
    </>
  );
}
