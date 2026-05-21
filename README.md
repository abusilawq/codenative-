# CodeNative

AI-powered code learning platform for the 80% of developers who don't speak English natively.
Built for **NextGenHacks** (deadline June 1, 2026).

## ✨ Features

1. **Code Explainer** — Paste code, get a line-by-line explanation in 20+ languages with difficulty modes.
2. **Story Mode** — Programming concepts as culturally rooted stories (recursion as matryoshka, async as prayer times…).
3. **RepoGuide** — Drop any GitHub URL, get a D3 visual map + learning path in your language.
4. **Daily Learning** — Personalized flashcards with SM-2 spaced repetition + streak counter.

## 🚀 Quick start

```powershell
# 1. Install pnpm if you don't have it
npm install -g pnpm

# 2. Install dependencies
cd codenative
pnpm install

# 3. Create .env.local from the example
cp .env.example .env.local
# then open .env.local and fill in:
#   ANTHROPIC_API_KEY  (required)
#   GITHUB_TOKEN       (recommended for RepoGuide)

# 4. Run
pnpm dev
```

Open http://localhost:3000

## 🔑 API keys

| Variable                          | Where to get it                                   | Required for |
| --------------------------------- | ------------------------------------------------- | ------------ |
| `ANTHROPIC_API_KEY`               | https://console.anthropic.com                     | Everything   |
| `GITHUB_TOKEN`                    | https://github.com/settings/tokens (public_repo)  | RepoGuide    |
| `NEXT_PUBLIC_SUPABASE_*`          | https://supabase.com (Day 10)                     | Auth later   |

## 🏗 Tech stack

- **Framework:** Next.js 14 (App Router) + TypeScript strict
- **Styling:** Tailwind CSS + custom design tokens + shadcn-style primitives
- **Animation:** Framer Motion
- **Editor:** Monaco Editor (`@monaco-editor/react`)
- **Visualization:** D3.js (repo tree)
- **AI:** Anthropic Claude — Sonnet 4.6 (explanations/stories), Haiku 4.5 (flashcards)
- **State:** Zustand (persisted to localStorage)
- **GitHub:** Octokit
- **Hosting:** Vercel

## 📁 Project structure

```
src/
├── app/
│   ├── layout.tsx, page.tsx, globals.css
│   ├── explain/page.tsx          ← Feature 1
│   ├── story/page.tsx            ← Feature 2
│   ├── repo/page.tsx             ← Feature 3
│   ├── learn/page.tsx            ← Feature 4
│   └── api/{explain,story,repo,flashcards}/route.ts
├── components/
│   ├── ui/             (button, card, input, select, tabs, dialog, …)
│   ├── landing/        (navbar, hero, features, footer)
│   ├── shared/         (logo, language-picker, difficulty-picker, page-shell)
│   ├── explain/        (code-editor, explanation-panel)
│   ├── story/          (story-card)
│   ├── repo/           (repo-tree)
│   └── learn/          (flashcard, streak-badge)
└── lib/
    ├── utils.ts, anthropic.ts, prompts.ts, store.ts, github.ts
    ├── types.ts, parse-json.ts
    └── i18n/languages.ts
```

## 🗺 Roadmap (16-day plan)

- ✅ Day 1-2 — Setup, design system, landing
- ✅ Day 3-5 — Code Explainer
- ✅ Day 6-7 — Story Mode
- ✅ Day 8-9 — RepoGuide
- ✅ Day 10-11 — Daily Learning (auth deferred)
- ⏳ Day 12-13 — Bonus features (pick 3-4)
- ⏳ Day 14-15 — Polish, mobile, accessibility
- ⏳ Day 16 — Demo video + Devpost submission

## 🎨 Design language

- Deep navy `#0A0E27` + warm gold `#F5B700` + glass morphism
- Inter (UI), JetBrains Mono (code), Plus Jakarta Sans (display)
- Springs only, never linear easing

## 📜 License

MIT — built with love for learners everywhere.
