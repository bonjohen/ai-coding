/**
 * Certification Quiz Engine
 * Manages quiz state, navigation, and answer evaluation
 */

import type { CertExamData } from './cert-xml-parser.js';
import type { CertAnswerRecord, CertSavedState } from './cert-progress-tracker.js';

export class CertQuizEngine {
  exam: CertExamData;
  currentIndex: number;
  answers: Map<number, CertAnswerRecord>;
  hintsRevealed: Map<number, Set<number>>;

  constructor(examData: CertExamData) {
    this.exam = examData;
    this.currentIndex = 0;
    this.answers = new Map();
    this.hintsRevealed = new Map();
  }

  get currentQuestion() {
    return this.exam.questions[this.currentIndex];
  }

  get totalQuestions(): number {
    return this.exam.questions.length;
  }

  get currentQuestionNumber(): number {
    return this.currentIndex + 1;
  }

  get score(): number {
    let correct = 0;
    this.answers.forEach(answer => {
      if (answer.isCorrect) correct++;
    });
    return correct;
  }

  get attemptedCount(): number {
    return this.answers.size;
  }

  navigateTo(index: number): boolean {
    if (index >= 0 && index < this.totalQuestions) {
      this.currentIndex = index;
      return true;
    }
    return false;
  }

  next(): boolean {
    return this.navigateTo(this.currentIndex + 1);
  }

  previous(): boolean {
    return this.navigateTo(this.currentIndex - 1);
  }

  submitAnswer(selectedLetter: string) {
    const question = this.currentQuestion;
    const isCorrect = selectedLetter === question.correctAnswer;

    this.answers.set(question.id, {
      selected: selectedLetter,
      isCorrect,
      hintsUsed: this.getRevealedHintLevels(question.id),
      timestamp: new Date().toISOString()
    });

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      selectedAnswer: selectedLetter
    };
  }

  hasAnswered(questionId: number): boolean {
    return this.answers.has(questionId);
  }

  getAnswer(questionId: number): CertAnswerRecord | undefined {
    return this.answers.get(questionId);
  }

  revealHint(questionId: number, level: number): void {
    if (!this.hintsRevealed.has(questionId)) {
      this.hintsRevealed.set(questionId, new Set());
    }
    this.hintsRevealed.get(questionId)!.add(level);
  }

  hideHint(questionId: number, level: number): void {
    const revealed = this.hintsRevealed.get(questionId);
    if (revealed) {
      revealed.delete(level);
      for (let l = level + 1; l <= 3; l++) {
        revealed.delete(l);
      }
    }
  }

  toggleHint(questionId: number, level: number): boolean {
    if (this.isHintRevealed(questionId, level)) {
      this.hideHint(questionId, level);
      return false;
    } else {
      this.revealHint(questionId, level);
      return true;
    }
  }

  isHintRevealed(questionId: number, level: number): boolean {
    const revealed = this.hintsRevealed.get(questionId);
    return revealed ? revealed.has(level) : false;
  }

  getRevealedHintLevels(questionId: number): number[] {
    const revealed = this.hintsRevealed.get(questionId);
    return revealed ? Array.from(revealed) : [];
  }

  canRevealHint(questionId: number, level: number): boolean {
    if (level === 1) return true;
    return this.isHintRevealed(questionId, level - 1);
  }

  getProgress() {
    return this.exam.questions.map(q => ({
      id: q.id,
      answered: this.hasAnswered(q.id),
      isCorrect: this.answers.get(q.id)?.isCorrect ?? null
    }));
  }

  exportResults() {
    const percentage = this.attemptedCount > 0
      ? Math.round((this.score / this.attemptedCount) * 100)
      : 0;

    return {
      examCode: this.exam.metadata.examCode,
      examTitle: this.exam.metadata.examTitle,
      totalQuestions: this.totalQuestions,
      attempted: this.attemptedCount,
      score: this.score,
      percentage,
      timestamp: new Date().toISOString(),
      details: Array.from(this.answers.entries()).map(([id, answer]) => ({
        questionId: id,
        selected: answer.selected,
        isCorrect: answer.isCorrect,
        hintsUsed: answer.hintsUsed
      }))
    };
  }

  getState() {
    return {
      currentIndex: this.currentIndex,
      answers: Array.from(this.answers.entries()),
      hintsRevealed: Array.from(this.hintsRevealed.entries()).map(
        ([id, set]) => [id, Array.from(set)]
      )
    };
  }

  restoreState(state: CertSavedState): void {
    if (state.currentIndex !== undefined) {
      this.currentIndex = state.currentIndex;
    }
    if (state.answers instanceof Map) {
      this.answers = state.answers;
    }
    if (state.hintsRevealed instanceof Map) {
      this.hintsRevealed = state.hintsRevealed;
    }
  }
}
