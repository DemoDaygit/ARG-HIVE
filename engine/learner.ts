import { AttemptStats, KnowledgeNode, LearnerState, LearnerStateV1, NodeProgress } from './types';

const STORAGE_KEY = 'arg-hive:learner:v1';

/** Expanding review intervals (days) — SM-2-lite schedule. */
const INTERVALS = [1, 3, 7, 16, 35, 70];

const DAY_MS = 24 * 60 * 60 * 1000;

function emptyState(): LearnerState {
  return { version: 2, xp: 0, streakDays: 0, lastActiveDay: '', progress: {}, attempts: {} };
}

/** v1 states predate quizzes: every learn/review was an implicit pass. */
function migrateV1(v1: LearnerStateV1): LearnerState {
  const attempts: Record<string, AttemptStats> = {};
  for (const [id, p] of Object.entries(v1.progress)) {
    attempts[id] = { correct: p.reviews + 1, wrong: 0 };
  }
  return { ...v1, version: 2, attempts };
}

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export function xpForLearn(node: KnowledgeNode): number {
  return node.difficulty * 25;
}

export function xpForReview(node: KnowledgeNode): number {
  return node.difficulty * 10;
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/** XP thresholds bounding the current level, for progress bars. */
export function levelBounds(xp: number): { current: number; next: number } {
  const level = levelFromXp(xp);
  return { current: (level - 1) ** 2 * 100, next: level ** 2 * 100 };
}

/**
 * The learner model, v2: knowledge is earned by answering quiz questions.
 * A correct answer advances the SM-2-lite schedule and grants XP; a wrong
 * answer on a due review lapses the memory (interval reset, mastery drop).
 * Pure state machine over LearnerState — persistence is a thin localStorage
 * adapter so the core stays testable.
 */
export class LearnerModel {
  state: LearnerState;

  constructor(state?: LearnerState) {
    this.state = state ?? LearnerModel.load();
  }

  static load(): LearnerState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      const parsed = JSON.parse(raw) as LearnerState | LearnerStateV1;
      if (parsed.version === 2) return parsed;
      if (parsed.version === 1) return migrateV1(parsed);
      return emptyState();
    } catch {
      return emptyState();
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // storage unavailable (private mode, quota) — keep in-memory state
    }
  }

  private touchStreak(now: number) {
    const today = dayKey(now);
    if (this.state.lastActiveDay === today) return;
    const yesterday = dayKey(now - DAY_MS);
    this.state.streakDays = this.state.lastActiveDay === yesterday ? this.state.streakDays + 1 : 1;
    this.state.lastActiveDay = today;
  }

  private recordAttempt(id: string, passed: boolean) {
    const a = this.state.attempts[id] ?? { correct: 0, wrong: 0 };
    if (passed) a.correct += 1;
    else a.wrong += 1;
    this.state.attempts[id] = a;
  }

  isLearned(id: string): boolean {
    return id in this.state.progress;
  }

  masteredSet(): Set<string> {
    return new Set(Object.keys(this.state.progress));
  }

  /** Total quiz attempts for a concept — drives question rotation. */
  attemptCount(id: string): number {
    const a = this.state.attempts[id];
    return a ? a.correct + a.wrong : 0;
  }

  /** Overall answer accuracy 0..1, or null before any attempt. */
  accuracy(): number | null {
    let correct = 0, total = 0;
    for (const a of Object.values(this.state.attempts)) {
      correct += a.correct;
      total += a.correct + a.wrong;
    }
    return total === 0 ? null : correct / total;
  }

  /** Concepts whose review is due (memory decay passed the threshold). */
  dueIds(now: number): string[] {
    return Object.entries(this.state.progress)
      .filter(([, p]) => p.dueAt <= now)
      .map(([id]) => id);
  }

  /** Overall mastery across the given concept set, 0..1. */
  masteryRatio(conceptIds: string[]): number {
    if (conceptIds.length === 0) return 0;
    const total = conceptIds.reduce((acc, id) => acc + (this.state.progress[id]?.mastery ?? 0), 0);
    return total / conceptIds.length;
  }

  /**
   * Record a study attempt (first learn or due review), graded by quiz
   * outcome. Returns XP awarded — 0 for a wrong answer, a not-yet-due
   * review, or a failed first attempt.
   */
  study(node: KnowledgeNode, now: number, passed = true): number {
    const existing = this.state.progress[node.id];
    this.recordAttempt(node.id, passed);

    if (!passed) {
      // Lapse: a due review answered wrong resets the memory schedule.
      if (existing && existing.dueAt <= now) {
        this.state.progress[node.id] = {
          ...existing,
          mastery: Math.max(0.3, existing.mastery - 0.15),
          intervalDays: INTERVALS[0],
          dueAt: now + INTERVALS[0] * DAY_MS,
        };
      }
      this.save();
      return 0;
    }

    if (!existing) {
      this.state.progress[node.id] = {
        mastery: 0.55,
        reviews: 0,
        intervalDays: INTERVALS[0],
        dueAt: now + INTERVALS[0] * DAY_MS,
        learnedAt: now,
      };
      this.touchStreak(now);
      this.state.xp += xpForLearn(node);
      this.save();
      return xpForLearn(node);
    }

    if (existing.dueAt > now) {
      this.save();
      return 0; // not due yet — no XP farming
    }

    // Advance from the CURRENT interval (lapses reset it to 1 day), rather
    // than from the lifetime review count.
    const nextInterval = INTERVALS.find((i) => i > existing.intervalDays) ?? INTERVALS[INTERVALS.length - 1];
    const updated: NodeProgress = {
      ...existing,
      reviews: existing.reviews + 1,
      mastery: Math.min(1, existing.mastery + 0.15),
      intervalDays: nextInterval,
      dueAt: now + nextInterval * DAY_MS,
    };
    this.state.progress[node.id] = updated;
    this.touchStreak(now);
    this.state.xp += xpForReview(node);
    this.save();
    return xpForReview(node);
  }

  forget(id: string) {
    delete this.state.progress[id];
    this.save();
  }

  reset() {
    this.state = emptyState();
    this.save();
  }
}
