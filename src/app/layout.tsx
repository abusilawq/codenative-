import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "CodeNative — Learn to code in your language",
  description:
    "AI-powered code learning for the 80% of developers who don't speak English natively. Explanations, cultural stories, and visual repo tours in 20+ languages.",
  keywords: ["learn to code", "AI tutor", "multilingual programming", "code explainer"],
  openGraph: {
    title: "CodeNative",
    description: "Learn to code in your native language. AI explanations, stories, and repo tours in 20+ languages.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0E27",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(inter.variable, jakarta.variable, jetbrains.variable, "min-h-screen font-sans")}>
        {children}
      </body>
    </html>
  );
}
