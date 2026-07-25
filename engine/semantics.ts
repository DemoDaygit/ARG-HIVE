import { Language } from '../types';
import { SemanticGraph, SearchHit } from './graph';
import { KnowledgeNode } from './types';
import { VectorIndex } from './vector';

/**
 * Hybrid semantic layer: lexical retrieval (exact/prefix matches, high
 * precision) blended with vector-space similarity (typo- and paraphrase-
 * tolerant recall). This is the single entry point the UI should use for
 * search and "related" surfaces.
 */
export class SemanticEngine {
  readonly graph: SemanticGraph;
  readonly index: VectorIndex;

  constructor(graph: SemanticGraph) {
    this.graph = graph;
    this.index = new VectorIndex(graph.nodes);
  }

  /** Blend: 55% normalized lexical score + 45% cosine similarity. */
  search(query: string, lang: Language, limit = 8): SearchHit[] {
    const q = query.trim();
    if (!q) return [];

    const lexical = this.graph.search(q, lang, this.graph.nodes.length);
    const maxLex = lexical.length > 0 ? lexical[0].score : 1;
    const lexById = new Map(lexical.map((h) => [h.node.id, h.score / maxLex]));

    const vector = this.index.query(q, this.graph.nodes.length);
    const vecById = new Map(vector.map((h) => [h.id, h.score]));

    const combined: SearchHit[] = [];
    for (const node of this.graph.nodes) {
      const lex = lexById.get(node.id) ?? 0;
      const vec = vecById.get(node.id) ?? 0;
      const score = lex * 0.55 + vec * 0.45;
      // Vector-only matches need a floor, or every node scores > 0 noise.
      if (lex > 0 || vec >= 0.18) combined.push({ node, score });
    }
    combined.sort((a, b) => b.score - a.score);
    return combined.slice(0, limit);
  }

  /** Graph-structural relevance blended with embedding similarity. */
  related(id: string, limit = 5): KnowledgeNode[] {
    const structural = this.graph.relatedScored(id, this.graph.nodes.length);
    const maxStruct = structural.length > 0 ? structural[0].score : 1;
    const structById = new Map(structural.map((s) => [s.node.id, s.score / maxStruct]));

    const vector = this.index.similar(id, this.graph.nodes.length);
    const scored = new Map<string, number>();
    for (const [nid, s] of structById) scored.set(nid, s * 0.6);
    for (const v of vector) {
      scored.set(v.id, (scored.get(v.id) ?? 0) + v.score * 0.4);
    }

    return Array.from(scored.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([nid]) => this.graph.node(nid)!)
      .filter(Boolean);
  }

  /**
   * Data-quality helper (used by tests/tooling, not the UI): pairs of
   * concepts whose embeddings are close but which share no edge — candidate
   * `relates` links for the next dataset revision.
   */
  suggestRelations(threshold = 0.45, limit = 10): { a: string; b: string; score: number }[] {
    const concepts = this.graph.nodes.filter((n) => n.kind === 'concept');
    const linked = new Set(
      this.graph.edges.flatMap((e) => [`${e.source}|${e.target}`, `${e.target}|${e.source}`]),
    );
    const out: { a: string; b: string; score: number }[] = [];
    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const a = concepts[i].id, b = concepts[j].id;
        if (linked.has(`${a}|${b}`)) continue;
        const va = this.index.vector(a)!, vb = this.index.vector(b)!;
        let dot = 0;
        for (let k = 0; k < va.length; k++) dot += va[k] * vb[k];
        if (dot >= threshold) out.push({ a, b, score: dot });
      }
    }
    out.sort((x, y) => y.score - x.score);
    return out.slice(0, limit);
  }
}
