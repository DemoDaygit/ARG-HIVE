import { KnowledgeNode } from './types';

/**
 * Deterministic vector-space semantics, phase 5 of the engine roadmap.
 *
 * Texts are embedded as L2-normalized bags of hashed character trigrams.
 * Character n-grams work across scripts, so one vector space covers both
 * English and Russian content of a node, and queries in either language
 * land near the right concepts. No network, no model weights — the same
 * interface can later be re-backed by real embedding APIs server-side.
 */

export const VECTOR_DIM = 512;

/** FNV-1a — stable, fast string hash for trigram bucketing. */
function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Accumulate weighted trigram counts of `text` into `vec` (not normalized). */
export function addTrigrams(vec: Float32Array, text: string, weight: number): void {
  const s = ` ${normalizeText(text)} `;
  if (s.length < 3) return;
  for (let i = 0; i <= s.length - 3; i++) {
    vec[fnv1a(s.slice(i, i + 3)) % VECTOR_DIM] += weight;
  }
}

export function l2Normalize(vec: Float32Array): Float32Array {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) sum += vec[i] * vec[i];
  if (sum > 0) {
    const inv = 1 / Math.sqrt(sum);
    for (let i = 0; i < vec.length; i++) vec[i] *= inv;
  }
  return vec;
}

export function embedText(text: string): Float32Array {
  const vec = new Float32Array(VECTOR_DIM);
  addTrigrams(vec, text, 1);
  return l2Normalize(vec);
}

/** Cosine similarity of two L2-normalized vectors (= dot product). */
export function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

export interface VectorHit {
  id: string;
  score: number;
}

/** Precomputed node embeddings with query / nearest-neighbour lookups. */
export class VectorIndex {
  private vectors = new Map<string, Float32Array>();

  constructor(nodes: KnowledgeNode[]) {
    for (const n of nodes) {
      const vec = new Float32Array(VECTOR_DIM);
      // Labels and tags dominate; descriptions add recall.
      addTrigrams(vec, n.label.en, 3);
      addTrigrams(vec, n.label.ru, 3);
      addTrigrams(vec, n.tags.join(' '), 2);
      addTrigrams(vec, n.desc.en, 1);
      addTrigrams(vec, n.desc.ru, 1);
      this.vectors.set(n.id, l2Normalize(vec));
    }
  }

  vector(id: string): Float32Array | undefined {
    return this.vectors.get(id);
  }

  query(text: string, limit = 8): VectorHit[] {
    const q = embedText(text);
    return this.rank((v) => cosine(q, v), null, limit);
  }

  similar(id: string, limit = 5): VectorHit[] {
    const origin = this.vectors.get(id);
    if (!origin) return [];
    return this.rank((v) => cosine(origin, v), id, limit);
  }

  private rank(
    score: (v: Float32Array) => number,
    excludeId: string | null,
    limit: number,
  ): VectorHit[] {
    const hits: VectorHit[] = [];
    for (const [id, vec] of this.vectors) {
      if (id === excludeId) continue;
      const s = score(vec);
      if (s > 0) hits.push({ id, score: s });
    }
    hits.sort((a, b) => b.score - a.score);
    return hits.slice(0, limit);
  }
}
