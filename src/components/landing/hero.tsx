"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { LANGUAGES } from "@/lib/i18n/languages";

export function Hero() {
  return (
    <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] max-w-[120vw] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <Badge variant="default" className="mb-5 sm:mb-6 px-3 py-1.5 text-xs sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Powered by Claude
          </Badge>

          <h1 className="font-display text-[2.25rem] leading-[1.1] sm:text-display-lg md:text-display-xl text-gradient-white mb-5 sm:mb-6 tracking-tight">
            Learn to code
            <br />
            <span className="text-gradient-gold">in your language</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mb-8 sm:mb-10 leading-relaxed px-2">
            80% of developers don&apos;t speak English natively. CodeNative breaks the barrier with
            AI explanations, cultural stories, and visual repo tours — in{" "}
            <span className="text-gold-400 font-semibold">20+ languages</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12 sm:mb-16 w-full sm:w-auto px-4 sm:px-0">
            <Button asChild size="lg" className="group">
              <Link href="/explain">
                Try the Code Explainer
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/story">See Story Mode</Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-2xl"
          >
            {LANGUAGES.slice(0, 10).map((lang, i) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.04 }}
                className="glass px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5"
              >
                <span>{lang.flag}</span>
                <span className="text-white/80">{lang.nativeName}</span>
              </motion.div>
            ))}
            <div className="glass px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm text-white/50">
              +{LANGUAGES.length - 10} more
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
