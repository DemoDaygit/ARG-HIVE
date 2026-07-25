# ARG H.I.V.E.

Interactive investor/учебная SPA about a decentralized Swarm AI network
(React 19 + Vite + three.js + Tailwind via CDN). Bilingual (en/ru).

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — production build (also run `npx tsc --noEmit` for types)
- Deploy: GitHub Actions → GitHub Pages (`.github/workflows/`), SPA served at
  `https://demodaygit.github.io/ARG-HIVE/`. Pages source must be set to
  "GitHub Actions" in repo settings.

## Structure

- `App.tsx` — section switcher; sections enumerated in `types.ts` (`SectionId`)
- `components/Views/*` — one view per section; `components/Layout/Sidebar.tsx`
- `contexts/LanguageContext.tsx` + `utils/translations.ts` — i18n (en/ru);
  views read strings via `useLanguage()`
- `engine/` — semantic knowledge-graph engine (see `docs/ENGINE.md`):
  ontology, dataset, graph algorithms, learner model. Framework-free.
- `components/Views/KnowledgeGraphView.tsx` — 3D graph UI on top of `engine/`

## Conventions & decisions

- All user-facing text is bilingual: UI chrome lives in `translations.ts`,
  graph node content lives in `engine/dataset.ts` as `{ en, ru }`,
  quiz cards live in `engine/quizzes.ts`.
- `engine/` stays pure TypeScript (no React/three.js) so it can move
  server-side later.
- Studying = answering a quiz card (graded SM-2 with lapses); search and
  "related" go through `engine/semantics.ts` (hybrid lexical + trigram VSM),
  not raw `SemanticGraph.search`.
- Learner state is versioned (`LearnerState.version`); breaking changes
  require an in-place migration in `learner.ts`.
- Tailwind is configured inline in `index.html` (custom `cyber-*` palette,
  `.glass-panel`); there is no tailwind.config file.
- Learner progress persists in `localStorage` (`arg-hive:learner:v1`).
- Dark, cyber-styled presentation: full-screen, no page scroll.
