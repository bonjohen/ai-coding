/**
 * Certification Quiz Progress Tracker
 * Persists quiz progress to localStorage
 */

import type { CertQuizEngine } from './cert-quiz-engine.js';

export interface CertSavedState {
  currentIndex: number;
  answers: Map<number, CertAnswerRecord>;
  hintsRevealed: Map<number, Set<number>>;
  lastSaved: string;
}

export interface CertAnswerRecord {
  selected: string;
  isCorrect: boolean;
  hintsUsed: number[];
  timestamp: string;
}

export class CertProgressTracker {
  private storageKey: string;

  constructor(examCode: string) {
    this.storageKey = `cert-quiz-${examCode}`;
  }

  save(quizEngine: CertQuizEngine): void {
    const state = {
      ...quizEngine.getState(),
      lastSaved: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  load(): CertSavedState | null {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return null;

      const state = JSON.parse(saved);
      if (!state || typeof state !== 'object') return null;

      let hintsRevealed = new Map<number, Set<number>>();
      if (Array.isArray(state.hintsRevealed)) {
        try {
          hintsRevealed = new Map(
            state.hintsRevealed
              .filter((item: unknown) => Array.isArray(item) && (item as unknown[]).length === 2)
              .map(([id, arr]: [number, number[]]) => [id, new Set(Array.isArray(arr) ? arr : [])])
          );
        } catch {
          hintsRevealed = new Map();
        }
      }

      let answers = new Map<number, CertAnswerRecord>();
      if (Array.isArray(state.answers)) {
        try {
          answers = new Map(
            state.answers.filter((item: unknown) => Array.isArray(item) && (item as unknown[]).length === 2)
          );
        } catch {
          answers = new Map();
        }
      }

      return {
        currentIndex: typeof state.currentIndex === 'number' ? state.currentIndex : 0,
        answers,
        hintsRevealed,
        lastSaved: state.lastSaved
      };
    } catch (e) {
      console.error('Failed to load saved progress:', e);
      return null;
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.error('Failed to clear progress:', e);
    }
  }

  saveResults(results: Record<string, unknown>): void {
    const historyKey = `${this.storageKey}-history`;
    try {
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      history.push(results);
      while (history.length > 10) history.shift();
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save results:', e);
    }
  }

  getHistory(): Record<string, unknown>[] {
    const historyKey = `${this.storageKey}-history`;
    try {
      return JSON.parse(localStorage.getItem(historyKey) || '[]');
    } catch (e) {
      console.error('Failed to get history:', e);
      return [];
    }
  }
}
