export type LanguageCode =
  | "uz" | "kk" | "ky" | "tg" | "tk" | "ru" | "tr" | "az" | "en" | "es"
  | "pt" | "fr" | "de" | "it" | "zh" | "ja" | "ko" | "hi" | "ar" | "id";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
  /** Cultural keyword hints used by AI prompts for story analogies */
  culturalHints: string[];
}

export const LANGUAGES: Language[] = [
  { code: "uz", name: "Uzbek", nativeName: "Oʻzbekcha", flag: "🇺🇿", culturalHints: ["matryoshka", "qaynona-kelin", "non yopish", "choyxona", "Buxoro savdosi"] },
  { code: "kk", name: "Kazakh", nativeName: "Қазақша", flag: "🇰🇿", culturalHints: ["yurta", "dombyra", "great steppe", "eagle hunting"] },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", flag: "🇰🇬", culturalHints: ["manaschi", "yurta", "komuz", "Issyk-Kul"] },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ", flag: "🇹🇯", culturalHints: ["Rudaki poetry", "Pamir mountains", "shashmaqom"] },
  { code: "tk", name: "Turkmen", nativeName: "Türkmençe", flag: "🇹🇲", culturalHints: ["Akhal-Teke horse", "carpet weaving", "Karakum"] },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", culturalHints: ["matryoshka", "shakhmaty (chess)", "Tolstoy", "babushka"] },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", culturalHints: ["bazaar haggling", "tea garden", "Istanbul ferry", "Nasreddin Hodja"] },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycanca", flag: "🇦🇿", culturalHints: ["mugham", "carpet patterns", "Caspian sea"] },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", culturalHints: ["football leagues", "afternoon tea", "Shakespeare"] },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", culturalHints: ["flamenco", "siesta", "tapas", "Cervantes"] },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", culturalHints: ["samba", "futebol", "carnaval"] },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", culturalHints: ["boulangerie", "Tour de France", "Molière"] },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", culturalHints: ["Oktoberfest", "engineering precision", "Brothers Grimm"] },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", culturalHints: ["espresso", "Renaissance", "opera"] },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", culturalHints: ["Confucius", "tea ceremony", "Great Wall", "Romance of the Three Kingdoms"] },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", culturalHints: ["origami", "samurai", "Studio Ghibli", "kintsugi"] },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", culturalHints: ["K-pop teamwork", "kimchi fermentation", "Korean drama"] },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", culturalHints: ["Mahabharata", "Ramayana", "cricket", "Diwali"] },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true, culturalHints: ["prayer times", "souq", "1001 Nights", "calligraphy"] },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", culturalHints: ["gotong royong", "wayang puppets", "Borobudur"] },
];

export const DEFAULT_LANGUAGE: LanguageCode = "uz";

export function getLanguage(code: LanguageCode): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
