"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, Twitter, Send, MessageCircle, ExternalLink } from "lucide-react";
import type { LanguageCode } from "@/lib/i18n/languages";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  analogy: string;
  takeaway: string;
  language: LanguageCode;
}

function buildShareUrl(opts: Omit<Props, "open" | "onOpenChange">) {
  if (typeof window === "undefined") return "";
  const origin = window.location.origin;
  const qs = new URLSearchParams({
    t: opts.title,
    a: opts.analogy,
    l: opts.language,
    k: opts.takeaway,
  });
  return `${origin}/share?${qs.toString()}`;
}

export function ShareDialog({ open, onOpenChange, title, analogy, takeaway, language }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(
    () => buildShareUrl({ title, analogy, takeaway, language }),
    [title, analogy, takeaway, language]
  );

  const ogPreview = useMemo(() => {
    if (typeof window === "undefined") return "";
    const qs = new URLSearchParams({ t: title, a: analogy, l: language, k: takeaway });
    return `${window.location.origin}/api/og?${qs.toString()}`;
  }, [title, analogy, takeaway, language]);

  const tweetText = `${title}\n\n✨ Generated with CodeNative — AI code learning in 20+ languages`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(tweetText)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${tweetText}\n${shareUrl}`)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(560px,calc(100vw-2rem))] max-h-[90vh] overflow-y-auto p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle>Share this story</DialogTitle>
          <DialogDescription>
            Your story turned into a beautiful social card. Post it anywhere.
          </DialogDescription>
        </DialogHeader>

        {/* OG preview — strict aspect ratio, never overflows */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-navy-950 w-full aspect-[1200/630]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ogPreview} alt="Share preview" className="w-full h-full object-cover block" />
        </div>

        {/* URL row */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 min-w-0">
          <code className="flex-1 min-w-0 text-xs font-mono text-white/70 truncate">{shareUrl}</code>
          <Button size="sm" variant={copied ? "secondary" : "default"} onClick={copyLink} className="shrink-0">
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" /> Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Share targets */}
        <div className="grid grid-cols-3 gap-2">
          <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
            <a href={twitterUrl} target="_blank" rel="noreferrer">
              <Twitter className="h-5 w-5" />
              <span className="text-xs">Twitter / X</span>
            </a>
          </Button>
          <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
            <a href={telegramUrl} target="_blank" rel="noreferrer">
              <Send className="h-5 w-5" />
              <span className="text-xs">Telegram</span>
            </a>
          </Button>
          <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">WhatsApp</span>
            </a>
          </Button>
        </div>

        <Button asChild variant="ghost" size="sm" className="text-xs">
          <a href={ogPreview} target="_blank" rel="noreferrer">
            <ExternalLink className="h-3.5 w-3.5" /> Open image in new tab
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
