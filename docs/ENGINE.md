# ARG H.I.V.E. — Semantic Knowledge Engine

The fundamental engine behind the learning knowledge graph. Pure TypeScript,
framework-free core (`engine/`), consumed by the 3D view
(`components/Views/KnowledgeGraphView.tsx`).

## Architecture

```
engine/
├── types.ts     Ontology: node kinds, domains, typed relations, learner state (v2)
├── dataset.ts   The semantic field: bilingual nodes + typed weighted edges
├── graph.ts     SemanticGraph: adjacency, learning paths, frontier, relevance, search
├── vector.ts    Hashed-trigram embeddings (VSM): cosine similarity, VectorIndex
├── semantics.ts SemanticEngine: hybrid lexical+vector search, blended related, edge suggestions
├── quiz.ts      QuizBank: question rotation logic
├── quizzes.ts   Quiz card data (authored via the content pipeline)
└── learner.ts   LearnerModel v2: graded SM-2 (lapses), accuracy, XP/streak, migration
```

### Ontology

Three layers share one graph:

| Layer    | Kinds                                        | Purpose                          |
|----------|----------------------------------------------|----------------------------------|
| Agents   | synthesizer, proposer, critic, validator     | The live swarm pipeline          |
| Tasks    | task                                         | External work entering the swarm |
| Concepts | concept (5 domains)                          | The learnable knowledge layer    |

Concept domains: `foundations`, `swarm`, `protocol`, `economics`, `learning`.

Typed relations (direction reads source → target):

- `feeds` — data/hypotheses flow along the pipeline (animated pulses in 3D)
- `grounds` — a concept grounds an agent's reasoning
- `requires` — target is a prerequisite of source (drives learning paths)
- `extends` — source deepens/specialises target
- `relates` — weak associative link

### Algorithms (`SemanticGraph`)

- **learningPath(id)** — transitive `requires` closure, topologically sorted,
  cycle-safe; the target comes last. This is the curriculum generator.
- **frontier(mastered)** — concepts whose prerequisites are all mastered:
  the "recommended next" surface, sorted easiest-first.
- **related(id)** — relevance ranking: direct edges (×3 weight) + shared tags
  (+0.8 each) + shared domain (+0.5).
- **search(query, lang)** — bilingual lexical scoring over labels, descriptions
  and language-neutral tags.

### Vector semantics (`vector.ts` + `semantics.ts`)

Texts embed as L2-normalized bags of hashed character trigrams (512 dims).
Character n-grams are script-agnostic, so English and Russian content share
one vector space and queries in either language (including typos) land near
the right concepts. `SemanticEngine` blends channels:

- **search** = 0.55 × normalized lexical score + 0.45 × cosine similarity
  (vector-only hits need cosine ≥ 0.18 to filter noise);
- **related** = 0.6 × graph-structural relevance + 0.4 × cosine;
- **suggestRelations** — close-but-unlinked concept pairs, candidate
  `relates` edges for the next dataset revision.

The interface is deliberately API-shaped: the trigram VSM can be re-backed
by real embedding models server-side without touching callers.

### Quiz layer (`quiz.ts` + `quizzes.ts`)

Studying a concept means answering a question, not clicking a button.
Every concept carries ≥2 bilingual multiple-choice cards (4 options, one
correct, with explanation). `QuizBank.pick(conceptId, attempt)` rotates
questions deterministically by attempt count, so retries and spaced reviews
see different questions. Content is authored by a multi-agent pipeline and
adversarially fact-checked before integration.

### Learner model (`LearnerModel`, state v2)

- **Graded study** — `study(node, now, passed)`: a correct answer advances
  the schedule and grants XP; a wrong answer on a due review is a *lapse*
  (interval resets to 1 day, mastery −0.15, floor 0.3, 0 XP); a failed first
  attempt records the attempt but does not mark the concept learned.
- **Mastery** per concept (0.55 on first learn, +0.15 per passed review, cap 1.0).
- **Spaced repetition** — SM-2-lite intervals: 1, 3, 7, 16, 35, 70 days,
  advancing from the *current* interval (so lapses replay the ladder).
  Reviews grant XP only when actually due (no farming).
- **Accuracy** — per-concept attempt history (`attempts`), aggregated into
  the HUD accuracy stat; exists even for concepts never learned.
- **Gamification** — XP (25×difficulty learn / 10×difficulty review),
  quadratic levels (`level = √(xp/100)+1`), daily streaks.
- **Persistence** — `localStorage` key `arg-hive:learner:v1`; v1 states are
  migrated in place (each historical study counts as a passed attempt);
  storage failures degrade to in-memory state.

## Roadmap

- **Phase 0 — Visualization** *(done)*: static 3D force-directed topology.
- **Phase 1 — Semantic core** *(done)*: ontology, typed relations, expanded
  bilingual dataset, graph algorithms, search.
- **Phase 2 — Learner model** *(done)*: mastery, SRS, XP/level/streak,
  persistence.
- **Phase 3 — UI integration** *(done)*: relation-colored edges, domain
  clusters, semantic search, path builder, mastery halos, learner HUD.
- **Phase 4 — Content depth** *(done)*: per-concept quiz cards (review =
  answer a question, not a click), graded SM-2 with lapses, learner state
  v2 migration, 2026 refresh of the concept layer.
- **Phase 5 — Vector semantics** *(done, local VSM)*: hashed-trigram
  embedding space, hybrid search, blended related, suggested `relates`
  edges. *Next step*: re-back `VectorIndex` with real embedding APIs via the
  server proxy, and generate concept summaries per learner level.
- **Phase 6 — Swarm layer**: shared progress, leaderboards, tie-in with
  Proof-of-Learning narrative (on-chain learning attestations).

## Invariants

- `engine/` must stay free of React/three.js imports (except types) so it can
  move server-side unchanged.
- Every node carries `en` + `ru` text; tags are language-neutral and lowercase.
- `requires` edges must stay acyclic (learningPath is cycle-safe, but a cycle
  is always a data bug).
- Every concept should carry ≥2 quiz cards; each card has exactly 4 options,
  one unambiguously correct, all text bilingual. Correct-answer positions
  must not cluster on one index.
- Bump `LearnerState.version` and add migration on any breaking state change
  (v1 → v2 migration lives in `learner.ts`).
