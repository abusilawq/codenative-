import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-sm text-white/40">
          Built for NextGenHacks · © {new Date().getFullYear()} CodeNative
        </p>
        <div className="flex items-center gap-4 text-sm text-white/50">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white">
            GitHub
          </a>
          <a href="https://anthropic.com" target="_blank" rel="noreferrer" className="hover:text-white">
            Anthropic
          </a>
        </div>
      </div>
    </footer>
  );
}
