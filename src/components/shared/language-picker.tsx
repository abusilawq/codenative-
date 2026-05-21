"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n/languages";
import { useAppStore } from "@/lib/store";

export function LanguagePicker({ className }: { className?: string }) {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  return (
    <Select value={language} onValueChange={(v) => setLanguage(v as LanguageCode)}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="inline-flex items-center gap-2">
              <span className="text-base">{lang.flag}</span>
              <span>{lang.nativeName}</span>
              <span className="text-xs text-white/40">— {lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
