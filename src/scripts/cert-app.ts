/**
 * Certification Quiz Application
 * Main orchestrator for the certification exam quiz UI.
 * Reads configuration from data attributes and embedded JSON manifest.
 */

import { CertXMLParser } from './cert-xml-parser.js';
import { CertQuizEngine } from './cert-quiz-engine.js';
import { CertProgressTracker } from './cert-progress-tracker.js';
import type { CertAnswerRecord } from './cert-progress-tracker.js';
import type { CertQuestion } from './cert-xml-parser.js';

interface CertManifestExam {
  id: string;
  slug: string;
  providerId: string;
  title: string;
  code: string;
  dataFile: string;
}

interface CertManifestProvider {
  id: string;
  name: string;
  slug: string;
}

interface CertManifest {
  providers: CertManifestProvider[];
  exams: CertManifestExam[];
}

interface CertElements {
  loading: HTMLElement | null;
  error: HTMLElement | null;
  errorText: HTMLElement | null;
  errorBackLink: HTMLAnchorElement | null;
  questionCard: HTMLElement | null;
  navigation: HTMLElement | null;
  backLink: HTMLAnchorElement | null;
  examCode: HTMLElement | null;
  examTitle: HTMLElement | null;
  currentNum: HTMLElement | null;
  totalNum: HTMLElement | null;
  score: HTMLElement | null;
  attempted: HTMLElement | null;
  percentComplete: HTMLElement | null;
  percentSuccess: HTMLElement | null;
  qNum: HTMLElement | null;
  questionTitle: HTMLElement | null;
  questionCategory: HTMLElement | null;
  scenarioSection: HTMLElement | null;
  scenarioText: HTMLElement | null;
  questionContent: HTMLElement | null;
  choicesFieldset: HTMLElement | null;
  submitAnswer: HTMLButtonElement | null;
  feedbackSection: HTMLElement | null;
  feedbackResult: HTMLElement | null;
  hintsSection: HTMLElement | null;
  hintsContent: HTMLElement | null;
  hintBtn1: HTMLButtonElement | null;
  hintBtn2: HTMLButtonElement | null;
  hintBtn3: HTMLButtonElement | null;
  prevQuestion: HTMLButtonElement | null;
  nextQuestion: HTMLButtonElement | null;
}

class CertQuizApp {
  private parser: CertXMLParser;
  private engine: CertQuizEngine | null = null;
  private tracker: CertProgressTracker | null = null;
  private categories: Record<string, string> = {};
  private elements: CertElements;
  private selectedAnswer: string | null = null;
  private manifest: CertManifest | null = null;
  private certBasePath: string;
  private backHref: string;

  constructor() {
    this.parser = new CertXMLParser();

    // Read configuration from data attributes on the page
    const mainEl = document.getElementById('cert-main');
    this.certBasePath = mainEl?.dataset.certBase || '';
    this.backHref = mainEl?.dataset.backHref || '';

    // Load manifest from embedded JSON
    const manifestEl = document.getElementById('cert-manifest');
    if (manifestEl) {
      try {
        this.manifest = JSON.parse(manifestEl.textContent || '');
      } catch {
        this.manifest = null;
      }
    }

    // All DOM IDs are prefixed with cert-
    this.elements = {
      loading: document.getElementById('cert-loading'),
      error: document.getElementById('cert-error'),
      errorText: document.getElementById('cert-error-text'),
      errorBackLink: document.getElementById('cert-error-back-link') as HTMLAnchorElement | null,
      questionCard: document.getElementById('cert-question-card'),
      navigation: document.getElementById('cert-navigation'),
      backLink: document.getElementById('cert-back-link') as HTMLAnchorElement | null,
      examCode: document.getElementById('cert-exam-code'),
      examTitle: document.getElementById('cert-exam-title'),
      currentNum: document.getElementById('cert-current-num'),
      totalNum: document.getElementById('cert-total-num'),
      score: document.getElementById('cert-score'),
      attempted: document.getElementById('cert-attempted'),
      percentComplete: document.getElementById('cert-percent-complete'),
      percentSuccess: document.getElementById('cert-percent-success'),
      qNum: document.getElementById('cert-q-num'),
      questionTitle: document.getElementById('cert-question-title'),
      questionCategory: document.getElementById('cert-question-category'),
      scenarioSection: document.getElementById('cert-scenario-section'),
      scenarioText: document.getElementById('cert-scenario-text'),
      questionContent: document.getElementById('cert-question-content'),
      choicesFieldset: document.getElementById('cert-choices-fieldset'),
      submitAnswer: document.getElementById('cert-submit-answer') as HTMLButtonElement | null,
      feedbackSection: document.getElementById('cert-feedback-section'),
      feedbackResult: document.getElementById('cert-feedback-result'),
      hintsSection: document.getElementById('cert-hints-section'),
      hintsContent: document.getElementById('cert-hints-content'),
      hintBtn1: document.getElementById('cert-hint-btn-1') as HTMLButtonElement | null,
      hintBtn2: document.getElementById('cert-hint-btn-2') as HTMLButtonElement | null,
      hintBtn3: document.getElementById('cert-hint-btn-3') as HTMLButtonElement | null,
      prevQuestion: document.getElementById('cert-prev-question') as HTMLButtonElement | null,
      nextQuestion: document.getElementById('cert-next-question') as HTMLButtonElement | null,
    };

    this.init();
  }

  private async init(): Promise<void> {
    const examId = this.getExamIdFromUrl();
    this.setBackLinks(examId);

    if (!examId) {
      this.showError('No exam specified. Please select an exam from the certifications page.');
      return;
    }

    try {
      // Look up exam in manifest to get dataFile path
      const examInfo = this.manifest?.exams.find(e => e.slug === examId);
      let examPath: string;

      if (examInfo) {
        examPath = this.certBasePath + examInfo.dataFile;
      } else {
        // Fallback: try to determine provider from exam ID
        const provider = this.getProviderFromExamId(examId);
        examPath = `${this.certBasePath}${provider}/${examId}.xml`;
      }

      const examData = await this.parser.loadExam(examPath);
      this.categories = examData.metadata.categories || {};
      this.engine = new CertQuizEngine(examData);
      this.tracker = new CertProgressTracker(examData.metadata.examCode);

      let savedState = null;
      try {
        savedState = this.tracker.load();
      } catch {
        this.tracker.clear();
      }

      if (savedState && savedState.answers && savedState.answers.size > 0) {
        this.showContinuePrompt(savedState);
        return;
      }

      this.startQuiz();
    } catch (err) {
      console.error('Failed to load exam:', err);
      this.showError(`Failed to load exam: ${(err as Error).message}`);
    }
  }

  private getExamIdFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('exam');
  }

  private getProviderFromExamId(examId: string): string {
    // Look up in manifest first
    if (this.manifest) {
      const exam = this.manifest.exams.find(e => e.slug === examId);
      if (exam) {
        const provider = this.manifest.providers.find(p => p.id === exam.providerId);
        if (provider) return provider.slug;
      }
    }

    // Fallback to prefix detection
    const id = examId.toLowerCase();
    if (id.startsWith('az-') || id.startsWith('dp-') || id.startsWith('ai-')) return 'azure';
    if (id.startsWith('clf-') || id.startsWith('saa-') || id.startsWith('dva-') ||
        id.startsWith('soa-') || id.startsWith('dea-') || id.startsWith('mla-') ||
        id.startsWith('aif-')) return 'aws';
    if (id.startsWith('gcp-')) return 'gcp';
    return 'azure';
  }

  private setBackLinks(examId: string | null): void {
    // Determine back URL from manifest or fallback
    let backUrl = this.backHref;
    if (examId && this.manifest) {
      const exam = this.manifest.exams.find(e => e.slug === examId);
      if (exam) {
        const provider = this.manifest.providers.find(p => p.id === exam.providerId);
        if (provider) {
          // Navigate back to the provider page
          backUrl = this.backHref.replace(/[^/]+\/$/, provider.slug + '/');
        }
      }
    }

    if (this.elements.backLink) {
      this.elements.backLink.href = backUrl || '#';
    }
    if (this.elements.errorBackLink) {
      this.elements.errorBackLink.href = backUrl || '#';
    }
  }

  private showError(message: string): void {
    if (this.elements.loading) this.elements.loading.hidden = true;
    if (this.elements.error) this.elements.error.hidden = false;
    if (this.elements.errorText) this.elements.errorText.textContent = message;
  }

  private showQuiz(): void {
    if (this.elements.loading) this.elements.loading.hidden = true;
    if (this.elements.questionCard) this.elements.questionCard.hidden = false;
    if (this.elements.navigation) this.elements.navigation.hidden = false;
    if (this.elements.hintsSection) this.elements.hintsSection.hidden = false;
  }

  private showContinuePrompt(savedState: { currentIndex: number; answers: Map<number, CertAnswerRecord>; hintsRevealed: Map<number, Set<number>>; lastSaved: string }): void {
    if (this.elements.loading) this.elements.loading.hidden = true;

    const answered = savedState.answers.size;
    const total = this.engine!.totalQuestions;
    let correct = 0;
    savedState.answers.forEach(answer => {
      if (answer.isCorrect) correct++;
    });

    const promptContainer = document.createElement('div');
    promptContainer.id = 'cert-continue-prompt';
    promptContainer.innerHTML = `
      <div class="cert-continue-prompt">
        <h2>Continue Previous Session?</h2>
        <p>You have a saved session for this exam:</p>
        <div class="cert-saved-stats">
          <div class="cert-stat">
            <span class="cert-stat-value">${answered}/${total}</span>
            <span class="cert-stat-label">Questions Answered</span>
          </div>
          <div class="cert-stat">
            <span class="cert-stat-value">${correct}/${answered}</span>
            <span class="cert-stat-label">Correct</span>
          </div>
          <div class="cert-stat">
            <span class="cert-stat-value">${answered > 0 ? Math.round((correct / answered) * 100) : 0}%</span>
            <span class="cert-stat-label">Success Rate</span>
          </div>
        </div>
        <div class="cert-prompt-buttons">
          <button id="cert-continue-yes" class="btn btn--primary">Continue Session</button>
          <button id="cert-continue-no" class="btn btn--secondary">Start Fresh</button>
        </div>
      </div>
    `;

    this.elements.questionCard?.parentElement?.appendChild(promptContainer);

    document.getElementById('cert-continue-yes')?.addEventListener('click', () => {
      this.engine!.restoreState(savedState);
      promptContainer.remove();
      this.startQuiz();
    });

    document.getElementById('cert-continue-no')?.addEventListener('click', () => {
      this.tracker!.clear();
      promptContainer.remove();
      this.startQuiz();
    });
  }

  private startQuiz(): void {
    this.setupEventListeners();
    this.updateHeader();
    this.renderQuestion();
    this.showQuiz();
  }

  private updateHeader(): void {
    const meta = this.engine!.exam.metadata;
    if (this.elements.examCode) this.elements.examCode.textContent = meta.examCode;
    if (this.elements.examTitle) this.elements.examTitle.textContent = meta.examTitle;
    if (this.elements.totalNum) this.elements.totalNum.textContent = String(this.engine!.totalQuestions);

    const examId = this.getExamIdFromUrl();
    const provider = this.getProviderFromExamId(examId || '');
    const providerNames: Record<string, string> = { azure: 'Azure', aws: 'AWS', gcp: 'Google Cloud' };
    document.title = `${meta.examCode} Quiz — ${providerNames[provider] || 'Cloud'} Certification Study`;
  }

  private setupEventListeners(): void {
    this.elements.submitAnswer?.addEventListener('click', () => this.submitAnswer());
    this.elements.prevQuestion?.addEventListener('click', () => this.navigatePrevious());
    this.elements.nextQuestion?.addEventListener('click', () => this.navigateNext());

    this.elements.hintBtn1?.addEventListener('click', () => this.toggleHint(1));
    this.elements.hintBtn2?.addEventListener('click', () => this.toggleHint(2));
    this.elements.hintBtn3?.addEventListener('click', () => this.toggleHint(3));

    document.addEventListener('keydown', (e) => {
      // Only handle arrow keys when the cert quiz is active
      if (!this.engine) return;
      if (e.key === 'ArrowLeft') this.navigatePrevious();
      if (e.key === 'ArrowRight') this.navigateNext();
    });
  }

  private renderQuestion(): void {
    const question = this.engine!.currentQuestion;
    const answer = this.engine!.getAnswer(question.id);
    const isAnswered = this.engine!.hasAnswered(question.id);

    if (this.elements.currentNum) this.elements.currentNum.textContent = String(this.engine!.currentQuestionNumber);
    if (this.elements.qNum) this.elements.qNum.textContent = String(this.engine!.currentQuestionNumber);
    if (this.elements.questionTitle) this.elements.questionTitle.textContent = question.title;

    const categoryName = this.categories[question.categoryRef] || question.categoryRef || '';
    if (this.elements.questionCategory) this.elements.questionCategory.textContent = categoryName;

    if (question.scenario) {
      if (this.elements.scenarioSection) this.elements.scenarioSection.hidden = false;
      if (this.elements.scenarioText) this.elements.scenarioText.innerHTML = question.scenario;
    } else {
      if (this.elements.scenarioSection) this.elements.scenarioSection.hidden = true;
    }

    if (this.elements.questionContent) this.elements.questionContent.innerHTML = question.questionText;

    this.renderChoices(question, answer, isAnswered);

    if (this.elements.submitAnswer) {
      this.elements.submitAnswer.disabled = true;
      this.elements.submitAnswer.hidden = isAnswered;
    }

    if (isAnswered && answer) {
      this.showFeedback(answer);
    } else {
      if (this.elements.feedbackSection) this.elements.feedbackSection.hidden = true;
    }

    this.renderHintButtons(question.id);
    this.renderHintContent(question);
    this.updateNavigationButtons();
    this.updateScoreDisplay();

    this.selectedAnswer = null;
  }

  private renderChoices(question: CertQuestion, answer: CertAnswerRecord | undefined, isAnswered: boolean): void {
    if (!this.elements.choicesFieldset) return;
    this.elements.choicesFieldset.innerHTML = '';

    question.choices.forEach(choice => {
      const label = document.createElement('label');
      label.className = 'cert-choice-option';

      if (isAnswered) {
        label.classList.add('disabled');
        if (choice.letter === question.correctAnswer) {
          label.classList.add('correct');
        } else if (choice.letter === answer?.selected) {
          label.classList.add('incorrect');
        }
      }

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'cert-answer';
      input.value = choice.letter;
      input.disabled = isAnswered;

      if (answer?.selected === choice.letter) {
        input.checked = true;
        label.classList.add('selected');
        this.selectedAnswer = choice.letter;
      }

      label.addEventListener('click', (e) => {
        if (isAnswered) return;
        e.preventDefault();

        if (this.selectedAnswer === choice.letter) {
          input.checked = false;
          label.classList.remove('selected');
          this.selectedAnswer = null;
          if (this.elements.submitAnswer) this.elements.submitAnswer.disabled = true;
        } else {
          this.elements.choicesFieldset!.querySelectorAll('input[type="radio"]').forEach(r => {
            (r as HTMLInputElement).checked = false;
          });
          this.elements.choicesFieldset!.querySelectorAll('.cert-choice-option').forEach(opt => {
            opt.classList.remove('selected');
          });
          input.checked = true;
          label.classList.add('selected');
          this.selectedAnswer = choice.letter;
          if (this.elements.submitAnswer) this.elements.submitAnswer.disabled = false;
        }
      });

      const letterSpan = document.createElement('span');
      letterSpan.className = 'cert-choice-letter';
      letterSpan.textContent = choice.letter;

      const textSpan = document.createElement('span');
      textSpan.className = 'cert-choice-text';
      textSpan.textContent = choice.text;

      label.appendChild(input);
      label.appendChild(letterSpan);
      label.appendChild(textSpan);

      this.elements.choicesFieldset!.appendChild(label);
    });
  }

  private submitAnswer(): void {
    if (!this.elements.choicesFieldset) return;
    const selected = this.elements.choicesFieldset.querySelector('input:checked') as HTMLInputElement | null;
    if (!selected) return;

    this.engine!.submitAnswer(selected.value);
    this.tracker!.save(this.engine!);

    const answer = this.engine!.getAnswer(this.engine!.currentQuestion.id);
    this.renderChoices(this.engine!.currentQuestion, answer, true);
    if (this.elements.submitAnswer) this.elements.submitAnswer.hidden = true;
    if (answer) this.showFeedback(answer);
    this.updateScoreDisplay();
  }

  private showFeedback(answer: CertAnswerRecord): void {
    if (!this.elements.feedbackSection || !this.elements.feedbackResult) return;
    this.elements.feedbackSection.hidden = false;
    this.elements.feedbackSection.className = 'cert-feedback ' + (answer.isCorrect ? 'correct' : 'incorrect');

    const icon = answer.isCorrect ? '\u2713' : '\u2717';
    const text = answer.isCorrect
      ? 'Correct!'
      : `Incorrect. The correct answer is ${this.engine!.currentQuestion.correctAnswer}.`;

    this.elements.feedbackResult.innerHTML = `
      <span class="cert-feedback-icon">${icon}</span>
      <span class="cert-feedback-text">${text}</span>
    `;
  }

  private renderHintButtons(questionId: number): void {
    [1, 2, 3].forEach(level => {
      const btn = this.elements[`hintBtn${level}` as keyof CertElements] as HTMLButtonElement | null;
      if (!btn) return;
      const isRevealed = this.engine!.isHintRevealed(questionId, level);
      const canReveal = this.engine!.canRevealHint(questionId, level);

      btn.classList.toggle('revealed', isRevealed);
      btn.disabled = !isRevealed && !canReveal;
    });
  }

  private renderHintContent(question: CertQuestion): void {
    if (!this.elements.hintsContent) return;
    this.elements.hintsContent.innerHTML = '';

    question.hints.forEach(hint => {
      if (this.engine!.isHintRevealed(question.id, hint.level)) {
        const div = document.createElement('div');
        div.className = 'cert-hint';
        div.dataset.level = String(hint.level);
        div.innerHTML = `
          <div class="cert-hint-label">${hint.label}</div>
          <div class="cert-hint-content">${hint.content}</div>
        `;
        this.elements.hintsContent!.appendChild(div);
      }
    });
  }

  private toggleHint(level: number): void {
    const questionId = this.engine!.currentQuestion.id;
    const isRevealed = this.engine!.isHintRevealed(questionId, level);

    if (!isRevealed && !this.engine!.canRevealHint(questionId, level)) return;

    this.engine!.toggleHint(questionId, level);
    this.tracker!.save(this.engine!);

    this.renderHintButtons(questionId);
    this.renderHintContent(this.engine!.currentQuestion);
  }

  private navigatePrevious(): void {
    if (this.engine?.previous()) this.renderQuestion();
  }

  private navigateNext(): void {
    if (this.engine?.next()) this.renderQuestion();
  }

  private updateNavigationButtons(): void {
    if (this.elements.prevQuestion) {
      this.elements.prevQuestion.disabled = this.engine!.currentIndex === 0;
    }
    if (this.elements.nextQuestion) {
      this.elements.nextQuestion.disabled = this.engine!.currentIndex === this.engine!.totalQuestions - 1;
    }
  }

  private updateScoreDisplay(): void {
    const total = this.engine!.totalQuestions;
    const attempted = this.engine!.attemptedCount;
    const score = this.engine!.score;

    if (this.elements.score) this.elements.score.textContent = String(score);
    if (this.elements.attempted) this.elements.attempted.textContent = String(attempted);

    const percentComplete = total > 0 ? Math.round((attempted / total) * 100) : 0;
    const percentSuccess = attempted > 0 ? Math.round((score / attempted) * 100) : 0;

    if (this.elements.percentComplete) this.elements.percentComplete.textContent = `${percentComplete}%`;
    if (this.elements.percentSuccess) this.elements.percentSuccess.textContent = `${percentSuccess}%`;
  }
}

/**
 * Initialize the certification quiz if on a cert quiz page.
 */
export function initCertQuiz(): void {
  const certMain = document.getElementById('cert-main');
  if (!certMain) return;
  new CertQuizApp();
}
