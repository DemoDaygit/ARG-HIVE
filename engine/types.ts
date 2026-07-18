import { Language } from '../types';

/** Roles a node can play in the swarm knowledge graph. */
export type NodeKind =
  | 'synthesizer'
  | 'proposer'
  | 'critic'
  | 'validator'
  | 'concept'
  | 'task';

/** Semantic domains that partition the concept layer. */
export type Domain =
  | 'foundations'
  | 'swarm'
  | 'protocol'
  | 'economics'
  | 'learning';

/**
 * Typed relations. Direction always reads source → target:
 *  - feeds:     data/hypotheses flow along the swarm pipeline
 *  - grounds:   an embedding/concept grounds an agent's reasoning
 *  - requires:  target is a prerequisite of source (learning dependency)
 *  - extends:   source deepens/specialises target
 *  - relates:   weak associative link
 */
export type RelationKind = 'feeds' | 'grounds' | 'requires' | 'extends' | 'relates';

export type LocalizedText = Record<Language, string>;

export interface KnowledgeNode {
  id: string;
  kind: NodeKind;
  /** Concept layer only — agents/tasks live outside domains. */
  domain?: Domain;
  /** 1 (foundational) … 5 (frontier). Drives path ordering and XP rewards. */
  difficulty: number;
  label: LocalizedText;
  desc: LocalizedText;
  /** Language-neutral tags powering search and relevance scoring. */
  tags: string[];
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  relation: RelationKind;
  /** 0..1 — semantic strength; scales spring length and relevance. */
  weight: number;
}

export interface SemanticField {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

/** Per-node learning state (SM-2-lite). */
export interface NodeProgress {
  mastery: number; // 0..1
  reviews: number;
  intervalDays: number;
  /** Epoch ms when the memory is considered due for review. */
  dueAt: number;
  learnedAt: number;
}

export interface LearnerState {
  version: 1;
  xp: number;
  streakDays: number;
  lastActiveDay: string; // YYYY-MM-DD
  progress: Record<string, NodeProgress>;
}
