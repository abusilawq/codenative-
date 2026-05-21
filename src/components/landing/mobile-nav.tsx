"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Code2, BookOpen, GitBranch, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explain", label: "Explain", icon: Code2 },
  { href: "/story", label: "Story", icon: BookOpen },
  { href: "/repo", label: "Repo", icon: GitBranch },
  { href: "/learn", label: "Daily", icon: Flame },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
      className="md:hidden fixed bottom-3 inset-x-3 z-40"
    >
      <div className="glass-strong rounded-2xl px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors min-w-[56px]",
                active ? "text-gold-400" : "text-white/60 hover:text-white"
              )}
            >
              {active && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-gold-500/15 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="h-5 w-5 relative z-10" />
              <span className="text-[10px] font-medium relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
