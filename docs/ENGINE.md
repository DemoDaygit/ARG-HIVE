# ARG H.I.V.E. — Semantic Knowledge Engine

The fundamental engine behind the learning knowledge graph. Pure TypeScript,
framework-free core (`engine/`), consumed by the 3D view
(`components/Views/KnowledgeGraphView.tsx`).

## Architecture

```
engine/
├── types.ts     Ontology: node kinds, domains, typed relations, learner state
├── dataset.ts   The semantic field: 37 bilingual nodes, ~58 typed edges
├── graph.ts     SemanticGraph: adjacency, learning paths, frontier, relevance, search
└── learner.ts   LearnerModel: mastery, SM-2-lite spaced repetition, XP/streak, localStorage
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

### Learner model (`LearnerModel`)

- **Mastery** per concept (0.55 on first learn, +0.15 per review, cap 1.0).
- **Spaced repetition** — SM-2-lite intervals: 1, 3, 7, 16, 35, 70 days.
  Reviews grant XP only when actually due (no farming).
- **Gamification** — XP (25×difficulty learn / 10×difficulty review),
  quadratic levels (`level = √(xp/100)+1`), daily streaks.
- **Persistence** — `localStorage` key `arg-hive:learner:v1`; storage failures
  degrade to in-memory state.

## Roadmap

- **Phase 0 — Visualization** *(done)*: static 3D force-directed topology.
- **Phase 1 — Semantic core** *(done)*: ontology, typed relations, expanded
  bilingual dataset, graph algorithms, search.
- **Phase 2 — Learner model** *(done)*: mastery, SRS, XP/level/streak,
  persistence.
- **Phase 3 — UI integration** *(done)*: relation-colored edges, domain
  clusters, semantic search, path builder, mastery halos, learner HUD.
- **Phase 4 — Content depth** *(next)*: per-concept quiz cards (review = answer
  a question, not a click), authoring format for datasets, dataset versioning
  and migration of learner state across graph versions.
- **Phase 5 — Real semantics**: embedding-based similarity via the API proxy
  (replace lexical search), auto-suggested `relates` edges, concept summaries
  generated per learner level.
- **Phase 6 — Swarm layer**: shared progress, leaderboards, tie-in with
  Proof-of-Learning narrative (on-chain learning attestations).

## Invariants

- `engine/` must stay free of React/three.js imports (except types) so it can
  move server-side unchanged.
- Every node carries `en` + `ru` text; tags are language-neutral and lowercase.
- `requires` edges must stay acyclic (learningPath is cycle-safe, but a cycle
  is always a data bug).
- Bump `LearnerState.version` and add migration on any breaking state change.
