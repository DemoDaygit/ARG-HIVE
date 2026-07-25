import { LocalizedText } from './types';

/**
 * Quiz layer, phase 4 of the engine roadmap: studying a concept means
 * answering a question about it, not clicking a button. Questions live in
 * `quizzes.ts` (data), this module is the logic.
 */

export interface QuizQuestion {
  /** `${conceptId}#${n}` — stable identity for analytics/rotation. */
  id: string;
  conceptId: string;
  prompt: LocalizedText;
  /** Exactly 4 options. */
  options: LocalizedText[];
  /** Index of the single correct option. */
  correct: number;
  explanation: LocalizedText;
}

export class QuizBank {
  private byConcept = new Map<string, QuizQuestion[]>();

  constructor(questions: QuizQuestion[]) {
    for (const q of questions) {
      const list = this.byConcept.get(q.conceptId);
      if (list) list.push(q);
      else this.byConcept.set(q.conceptId, [q]);
    }
  }

  has(conceptId: string): boolean {
    return this.byConcept.has(conceptId);
  }

  count(conceptId: string): number {
    return this.byConcept.get(conceptId)?.length ?? 0;
  }

  /**
   * Deterministic rotation: attempt №n gets question n mod count, so
   * consecutive attempts (and spaced reviews) see different questions.
   */
  pick(conceptId: string, attempt: number): QuizQuestion | null {
    const qs = this.byConcept.get(conceptId);
    if (!qs || qs.length === 0) return null;
    return qs[((attempt % qs.length) + qs.length) % qs.length];
  }
}
