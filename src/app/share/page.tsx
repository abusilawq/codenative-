import type { Metadata } from "next";
import Link from "next/link";
import { getLanguage, type LanguageCode } from "@/lib/i18n/languages";
import { Navbar } from "@/components/landing/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface SearchParams {
  t?: string; // title
  a?: string; // analogy
  l?: string; // language code
  k?: string; // takeaway / kicker
}

const SITE = "https://codenative-rosy.vercel.app";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const title = sp.t ?? "Learn to code in your language";
  const takeaway = sp.k ?? "AI-powered code learning in 20+ languages.";
  const qs = new URLSearchParams();
  if (sp.t) qs.set("t", sp.t);
  if (sp.a) qs.set("a", sp.a);
  if (sp.l) qs.set("l", sp.l);
  if (sp.k) qs.set("k", sp.k);
  const ogImage = `${SITE}/api/og?${qs.toString()}`;

  return {
    title: `${title} · CodeNative`,
    description: takeaway,
    openGraph: {
      title,
      description: takeaway,
      url: `${SITE}/share?${qs.toString()}`,
      siteName: "CodeNative",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: takeaway,
      images: [ogImage],
    },
  };
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const title = sp.t ?? "Learn to code in your language";
  const analogy = sp.a ?? "Story Mode";
  const lang = (sp.l ?? "uz") as LanguageCode;
  const takeaway = sp.k ?? "";
  const language = getLanguage(lang);

  const qs = new URLSearchParams();
  if (sp.t) qs.set("t", sp.t);
  if (sp.a) qs.set("a", sp.a);
  if (sp.l) qs.set("l", sp.l);
  if (sp.k) qs.set("k", sp.k);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <Navbar />
      <main className="container relative pt-24 sm:pt-28 pb-28 md:pb-16 max-w-3xl">
        <div className="mb-6 text-center">
          <Badge variant="default" className="mb-3">
            <Sparkles className="h-3 w-3 mr-1" /> Shared story
          </Badge>
          <h1 className="font-display text-2xl sm:text-3xl text-gradient-white">A story from CodeNative</h1>
        </div>

        <Card className="overflow-hidden mb-6">
          <CardContent className="p-0">
            {/* Show the OG card directly */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/og?${qs.toString()}`}
              alt={title}
              width={1200}
              height={630}
              className="w-full h-auto"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 sm:p-8" dir={language.rtl ? "rtl" : "ltr"}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{language.flag}</span>
              <Badge>{analogy}</Badge>
              <Badge variant="secondary">{language.nativeName}</Badge>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl text-gradient-gold mb-4 leading-tight">
              {title}
            </h2>

            {takeaway && (
              <p className="border-l-2 border-gold-500 pl-4 italic text-white/85 mb-6 leading-relaxed">
                {takeaway}
              </p>
            )}

            <div className="pt-6 border-t border-white/5">
              <p className="text-white/60 text-sm mb-4">
                Want to generate stories like this in your language?
              </p>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/story">
                  Try Story Mode <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
