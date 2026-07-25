import { Language } from '../types';
import { KnowledgeEdge, KnowledgeNode, SemanticField } from './types';

export interface SearchHit {
  node: KnowledgeNode;
  score: number;
}

/**
 * In-memory semantic graph engine: adjacency indexes, prerequisite resolution,
 * relevance ranking and bilingual lexical search. Pure logic — no rendering,
 * no React, no globals — so it can later move server-side unchanged.
 */
export class SemanticGraph {
  readonly nodes: KnowledgeNode[];
  readonly edges: KnowledgeEdge[];

  private byId = new Map<string, KnowledgeNode>();
  private out = new Map<string, KnowledgeEdge[]>();
  private in = new Map<string, KnowledgeEdge[]>();

  constructor(field: SemanticField) {
    this.nodes = field.nodes;
    this.edges = field.edges;
    for (const n of field.nodes) {
      this.byId.set(n.id, n);
      this.out.set(n.id, []);
      this.in.set(n.id, []);
    }
    for (const e of field.edges) {
      this.out.get(e.source)?.push(e);
      this.in.get(e.target)?.push(e);
    }
  }

  node(id: string): KnowledgeNode | undefined {
    return this.byId.get(id);
  }

  /** All edges touching a node, regardless of direction. */
  incident(id: string): KnowledgeEdge[] {
    return [...(this.out.get(id) ?? []), ...(this.in.get(id) ?? [])];
  }

  degree(id: string): number {
    return this.incident(id).length;
  }

  /** Direct prerequisites of a concept (its outgoing `requires` targets). */
  prerequisites(id: string): KnowledgeNode[] {
    return (this.out.get(id) ?? [])
      .filter((e) => e.relation === 'requires')
      .map((e) => this.byId.get(e.target)!)
      .filter(Boolean);
  }

  /**
   * Ordered study plan for a target concept: the transitive `requires` closure,
   * topologically sorted so every prerequisite precedes its dependents;
   * the target itself comes last. Cycle-safe.
   */
  learningPath(targetId: string): KnowledgeNode[] {
    const target = this.byId.get(targetId);
    if (!target) return [];

    const closure = new Set<string>();
    const visit = (id: string) => {
      if (closure.has(id)) return;
      closure.add(id);
      for (const p of this.prerequisites(id)) visit(p.id);
    };
    visit(targetId);

    const ordered: string[] = [];
    const state = new Map<string, 'open' | 'done'>();
    const topo = (id: string) => {
      const s = state.get(id);
      if (s === 'done') return;
      if (s === 'open') return; // cycle guard
      state.set(id, 'open');
      for (const p of this.prerequisites(id)) {
        if (closure.has(p.id)) topo(p.id);
      }
      state.set(id, 'done');
      ordered.push(id);
    };
    topo(targetId);

    return ordered.map((id) => this.byId.get(id)!).filter(Boolean);
  }

  /**
   * Recommended next concepts: not yet mastered, but with every prerequisite
   * mastered. Sorted easiest-first so the learner always has a viable step.
   */
  frontier(mastered: ReadonlySet<string>, limit = 5): KnowledgeNode[] {
    return this.nodes
      .filter((n) => n.kind === 'concept' && !mastered.has(n.id))
      .filter((n) => this.prerequisites(n.id).every((p) => mastered.has(p.id)))
      .sort((a, b) => a.difficulty - b.difficulty || this.degree(b.id) - this.degree(a.id))
      .slice(0, limit);
  }

  /**
   * Semantic relevance of other nodes to `id`: direct edges weigh most, then
   * shared tags, then shared domain.
   */
  related(id: string, limit = 5): KnowledgeNode[] {
    return this.relatedScored(id, limit).map((s) => s.node);
  }

  /** Scored variant of `related`, for blending with vector similarity. */
  relatedScored(id: string, limit = 5): { node: KnowledgeNode; score: number }[] {
    const origin = this.byId.get(id);
    if (!origin) return [];
    const originTags = new Set(origin.tags);
    const adjacent = new Map<string, number>();
    for (const e of this.incident(id)) {
      const other = e.source === id ? e.target : e.source;
      adjacent.set(other, Math.max(adjacent.get(other) ?? 0, e.weight));
    }

    const scored = this.nodes
      .filter((n) => n.id !== id)
      .map((n) => {
        let score = (adjacent.get(n.id) ?? 0) * 3;
        score += n.tags.filter((t) => originTags.has(t)).length * 0.8;
        if (origin.domain && n.domain === origin.domain) score += 0.5;
        return { node: n, score };
      })
      .filter((s) => s.score > 0);

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }

  /** Bilingual lexical search over labels, descriptions and tags. */
  search(query: string, lang: Language, limit = 8): SearchHit[] {
    const terms = query.toLowerCase().split(/[\s,·]+/).filter((t) => t.length > 1);
    if (terms.length === 0) return [];

    const hits: SearchHit[] = [];
    for (const n of this.nodes) {
      const label = n.label[lang].toLowerCase();
      const desc = n.desc[lang].toLowerCase();
      const tags = n.tags.join(' ');
      let score = 0;
      for (const term of terms) {
        if (label.includes(term)) score += label.startsWith(term) ? 5 : 3;
        if (tags.includes(term)) score += 2;
        if (desc.includes(term)) score += 1;
      }
      if (score > 0) hits.push({ node: n, score });
    }
    hits.sort((a, b) => b.score - a.score);
    return hits.slice(0, limit);
  }
}
