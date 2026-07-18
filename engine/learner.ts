import { KnowledgeNode, LearnerState, NodeProgress } from './types';

const STORAGE_KEY = 'arg-hive:learner:v1';

/** Expanding review intervals (days) — SM-2-lite schedule. */
const INTERVALS = [1, 3, 7, 16, 35, 70];

const DAY_MS = 24 * 60 * 60 * 1000;

function emptyState(): LearnerState {
  return { version: 1, xp: 0, streakDays: 0, lastActiveDay: '', progress: {} };
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
 * The learner model: per-concept mastery with spaced-repetition scheduling,
 * plus XP / streak gamification. Pure state machine over LearnerState —
 * persistence is a thin localStorage adapter so the core stays testable.
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
      const parsed = JSON.parse(raw) as LearnerState;
      if (parsed.version !== 1) return emptyState();
      return parsed;
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

  isLearned(id: string): boolean {
    return id in this.state.progress;
  }

  masteredSet(): Set<string> {
    return new Set(Object.keys(this.state.progress));
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
   * First-time learn or a due review of a node. Returns the XP awarded
   * (0 when the node is already fresh in memory).
   */
  study(node: KnowledgeNode, now: number): number {
    const existing = this.state.progress[node.id];

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

    if (existing.dueAt > now) return 0; // not due yet — no XP farming

    const nextIdx = Math.min(existing.reviews + 1, INTERVALS.length - 1);
    const updated: NodeProgress = {
      ...existing,
      reviews: existing.reviews + 1,
      mastery: Math.min(1, existing.mastery + 0.15),
      intervalDays: INTERVALS[nextIdx],
      dueAt: now + INTERVALS[nextIdx] * DAY_MS,
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
