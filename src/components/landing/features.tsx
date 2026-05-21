"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, BookOpen, GitBranch, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    href: "/explain",
    icon: Code2,
    title: "Code Explainer",
    description: "Paste any code. Get a line-by-line explanation in your native language with difficulty modes.",
    color: "from-gold-400 to-gold-600",
  },
  {
    href: "/story",
    icon: BookOpen,
    title: "Story Mode",
    description: "Recursion as matryoshka. Async as prayer times. Cultural analogies that stick forever.",
    color: "from-purple-400 to-pink-500",
  },
  {
    href: "/repo",
    icon: GitBranch,
    title: "RepoGuide",
    description: "Drop any GitHub URL. Get a visual tour and a learning path through the codebase.",
    color: "from-emerald-400 to-cyan-500",
  },
  {
    href: "/learn",
    icon: Flame,
    title: "Daily Learning",
    description: "Personalized flashcards with spaced repetition. Build a streak. Code every day.",
    color: "from-orange-400 to-rose-500",
  },
];

export function Features() {
  return (
    <section className="container py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-display-md text-gradient-white mb-3">Four ways to learn</h2>
        <p className="text-white/60 max-w-xl mx-auto">
          Every feature is designed for non-English speakers who refuse to be left behind.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={feature.href} className="block group">
                <Card className="h-full transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-1">
                  <CardContent className="p-7">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/60 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
