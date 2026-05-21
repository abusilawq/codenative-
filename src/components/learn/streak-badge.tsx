"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function StreakBadge() {
  const streak = useAppStore((s) => s.streak);
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Flame className="h-5 w-5 text-orange-400" />
      </motion.div>
      <span className="font-display font-bold text-lg">{streak}</span>
      <span className="text-sm text-white/60">day streak</span>
    </motion.div>
  );
}
