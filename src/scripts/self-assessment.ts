/**
 * Self-assessment flow: walks through 7 dimensions, 3 questions each,
 * calculates scores, renders radar chart, persists to localStorage.
 */
import { renderRadarChart } from './radar-chart.js';

interface Choice { value: number; label: string; }
interface StudyLink { label: string; href: string; }
interface Question {
  id: string;
  text: string;
  choices: Choice[];
  dimensionId: string;
  levelId: string;
  studyLinks: StudyLink[];
  explanation: string;
}
interface DimensionMeta {
  id: string;
  name: string;
  shortName: string;
  summary: string;
}
interface AssessmentState {
  answers: Record<string, number>;
  currentDimIndex: number;
}
interface SavedAssessment {
  completedAt: string;
  answers: Record<string, number>;
  dimensionScores: Record<string, number>;
  estimatedLevel: number;
  version: number;
}

const STORAGE_KEY = 'ccc-assessment';

function getStoredAssessment(): SavedAssessment | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveAssessment(data: SavedAssessment): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function estimateLevel(avgScore: number): number {
  if (avgScore < 1.5) return 1;
  if (avgScore < 2.25) return 2;
  if (avgScore < 3.0) return 3;
  if (avgScore < 3.5) return 4;
  return 5;
}

const levelNames: Record<number, { title: string; slug: string }> = {
  1: { title: 'Operator', slug: 'operator' },
  2: { title: 'Structured Collaborator', slug: 'structured-collaborator' },
  3: { title: 'Environment Builder', slug: 'environment-builder' },
  4: { title: 'Workflow Engineer', slug: 'workflow-engineer' },
  5: { title: 'Agentic Systems Expert', slug: 'agentic-systems-expert' },
};

export function initAssessment(): void {
  const app = document.getElementById('assessment-app');
  if (!app) return;

  const dataEl = document.getElementById('assessment-data');
  const metaEl = document.getElementById('dimensions-meta');
  if (!dataEl || !metaEl) return;

  let questions: Question[];
  let dimensions: DimensionMeta[];
  try {
    questions = JSON.parse(dataEl.textContent || '[]');
    dimensions = JSON.parse(metaEl.textContent || '[]');
  } catch { return; }

  if (questions.length === 0 || dimensions.length === 0) return;

  // Group questions by dimension
  const questionsByDim = new Map<string, Question[]>();
  for (const q of questions) {
    const list = questionsByDim.get(q.dimensionId) || [];
    list.push(q);
    questionsByDim.set(q.dimensionId, list);
  }

  // Check for previous assessment
  const previous = getStoredAssessment();
  if (previous) {
    renderPreviousResults(app, previous, dimensions, questionsByDim, questions);
    return;
  }

  startAssessment(app, dimensions, questionsByDim);
}

function startAssessment(
  app: HTMLElement,
  dimensions: DimensionMeta[],
  questionsByDim: Map<string, Question[]>
): void {
  const state: AssessmentState = { answers: {}, currentDimIndex: 0 };
  renderDimensionStep(app, state, dimensions, questionsByDim);
}

function renderDimensionStep(
  app: HTMLElement,
  state: AssessmentState,
  dimensions: DimensionMeta[],
  questionsByDim: Map<string, Question[]>
): void {
  const dim = dimensions[state.currentDimIndex];
  const dimQuestions = questionsByDim.get(dim.id) || [];
  const total = dimensions.length;
  const current = state.currentDimIndex + 1;
  const progress = (current / total) * 100;

  app.innerHTML = `
    <div class="assess-progress">
      <div class="assess-progress__bar" style="width: ${progress}%"></div>
    </div>
    <p class="assess-progress__label">Dimension ${current} of ${total}</p>
    <div class="assess-dimension">
      <h2 class="assess-dimension__name">${dim.name}</h2>
      <p class="assess-dimension__summary">${dim.summary}</p>
    </div>
    <div class="assess-questions">
      ${dimQuestions.map((q, i) => `
        <div class="assess-question" data-qid="${q.id}">
          <p class="assess-question__text">${q.text}</p>
          <div class="assess-choices">
            ${q.choices.map(c => `
              <button class="assess-choice${state.answers[q.id] === c.value ? ' assess-choice--selected' : ''}"
                      data-qid="${q.id}" data-value="${c.value}">
                <span class="assess-choice__value">${c.value}</span>
                <span class="assess-choice__label">${c.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    <div class="assess-nav">
      ${state.currentDimIndex > 0 ? '<button class="assess-nav__btn assess-nav__prev">Back</button>' : '<span></span>'}
      <button class="assess-nav__btn assess-nav__next" disabled>
        ${state.currentDimIndex === total - 1 ? 'See Results' : 'Next Dimension'}
      </button>
    </div>
  `;

  // Wire up choice buttons
  app.querySelectorAll('.assess-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = btn.getAttribute('data-qid')!;
      const val = Number(btn.getAttribute('data-value')!);
      state.answers[qid] = val;

      // Update selected state for this question
      const parent = btn.closest('.assess-question')!;
      parent.querySelectorAll('.assess-choice').forEach(b => b.classList.remove('assess-choice--selected'));
      btn.classList.add('assess-choice--selected');

      // Enable next if all questions in this dimension are answered
      const allAnswered = dimQuestions.every(q => state.answers[q.id] !== undefined);
      const nextBtn = app.querySelector('.assess-nav__next') as HTMLButtonElement;
      if (nextBtn && allAnswered) nextBtn.disabled = false;
    });
  });

  // Wire next/prev
  const nextBtn = app.querySelector('.assess-nav__next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (state.currentDimIndex < dimensions.length - 1) {
        state.currentDimIndex++;
        renderDimensionStep(app, state, dimensions, questionsByDim);
      } else {
        showResults(app, state, dimensions, questionsByDim);
      }
    });
  }

  const prevBtn = app.querySelector('.assess-nav__prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      state.currentDimIndex--;
      renderDimensionStep(app, state, dimensions, questionsByDim);
    });
  }

  // Check if already answered (going back)
  const allAnswered = dimQuestions.every(q => state.answers[q.id] !== undefined);
  if (allAnswered) {
    const nb = app.querySelector('.assess-nav__next') as HTMLButtonElement;
    if (nb) nb.disabled = false;
  }
}

function showResults(
  app: HTMLElement,
  state: AssessmentState,
  dimensions: DimensionMeta[],
  questionsByDim: Map<string, Question[]>
): void {
  // Calculate per-dimension scores
  const dimScores: Record<string, number> = {};
  for (const dim of dimensions) {
    const qs = questionsByDim.get(dim.id) || [];
    const scores = qs.map(q => state.answers[q.id] || 1);
    dimScores[dim.id] = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  const avgScore = Object.values(dimScores).reduce((a, b) => a + b, 0) / dimensions.length;
  const level = estimateLevel(avgScore);
  const lv = levelNames[level];

  // Save
  const saved: SavedAssessment = {
    completedAt: new Date().toISOString(),
    answers: state.answers,
    dimensionScores: dimScores,
    estimatedLevel: level,
    version: 1,
  };
  saveAssessment(saved);

  renderResultsView(app, saved, dimensions, questionsByDim);
}

function renderPreviousResults(
  app: HTMLElement,
  saved: SavedAssessment,
  dimensions: DimensionMeta[],
  questionsByDim: Map<string, Question[]>,
  allQuestions: Question[]
): void {
  const date = new Date(saved.completedAt).toLocaleDateString();
  app.innerHTML = `
    <div class="assess-previous">
      <p class="text-muted">You completed an assessment on ${date}.</p>
      <div class="flex gap-md mt-md">
        <button class="assess-nav__btn" id="view-results">View Results</button>
        <button class="assess-nav__btn assess-nav__btn--secondary" id="retake">Retake Assessment</button>
      </div>
    </div>
  `;

  document.getElementById('view-results')?.addEventListener('click', () => {
    renderResultsView(app, saved, dimensions, questionsByDim);
  });

  document.getElementById('retake')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    startAssessment(app, dimensions, questionsByDim);
  });
}

function renderResultsView(
  app: HTMLElement,
  saved: SavedAssessment,
  dimensions: DimensionMeta[],
  questionsByDim: Map<string, Question[]>
): void {
  const level = saved.estimatedLevel;
  const lv = levelNames[level];
  const avgScore = Object.values(saved.dimensionScores).reduce((a, b) => a + b, 0) / dimensions.length;
  const basePath = document.querySelector('link[rel="canonical"]')?.getAttribute('href')?.replace(/assess\/$/, '') || '/ai-coding/claude-code-competence/';

  // Identify weak areas for study recommendations
  const weakDims = dimensions.filter(d => saved.dimensionScores[d.id] < 2.5);
  const developingDims = dimensions.filter(d => saved.dimensionScores[d.id] >= 2.5 && saved.dimensionScores[d.id] < 3.0);
  const strongDims = dimensions.filter(d => saved.dimensionScores[d.id] >= 3.0);

  app.innerHTML = `
    <div class="assess-results">
      <div class="assess-results__header">
        <div id="radar-chart" class="assess-results__chart"></div>
        <div class="assess-results__summary">
          <h2>Your Estimated Level</h2>
          <div class="assess-results__level">
            <span class="badge badge--level-${level}">Level ${level}</span>
            <span class="assess-results__level-name">${lv.title}</span>
          </div>
          <p class="text-muted mt-md">Average score: ${avgScore.toFixed(1)} / 4.0</p>
          <a href="${basePath}levels/${lv.slug}/" class="assess-nav__btn mt-lg" style="display:inline-block;text-decoration:none;">View Level ${level} Details &rarr;</a>
        </div>
      </div>

      <section class="section">
        <h2>Dimension Breakdown</h2>
        <div class="assess-dim-grid">
          ${dimensions.map(d => {
            const score = saved.dimensionScores[d.id];
            const pct = (score / 4) * 100;
            const tier = score < 2.5 ? 'weak' : score < 3.0 ? 'developing' : 'strong';
            return `
              <div class="assess-dim-card assess-dim-card--${tier}">
                <div class="assess-dim-card__header">
                  <span class="assess-dim-card__name">${d.shortName}</span>
                  <span class="assess-dim-card__score">${score.toFixed(1)}</span>
                </div>
                <div class="assess-dim-card__bar">
                  <div class="assess-dim-card__fill" style="width: ${pct}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      ${weakDims.length > 0 ? `
      <section class="section">
        <h2>Priority: Focus Areas</h2>
        <p class="text-muted mb-md">These dimensions scored below 2.5. Focused study here will have the most impact.</p>
        <ul>
          ${weakDims.map(d => `<li><a href="${basePath}dimensions/">${d.name}</a> — score: ${saved.dimensionScores[d.id].toFixed(1)}</li>`).join('')}
        </ul>
      </section>
      ` : ''}

      ${developingDims.length > 0 ? `
      <section class="section">
        <h2>Developing: Good Progress</h2>
        <ul>
          ${developingDims.map(d => `<li><a href="${basePath}dimensions/">${d.name}</a> — score: ${saved.dimensionScores[d.id].toFixed(1)}</li>`).join('')}
        </ul>
      </section>
      ` : ''}

      ${strongDims.length > 0 ? `
      <section class="section">
        <h2>Strong: Keep It Up</h2>
        <ul>
          ${strongDims.map(d => `<li><a href="${basePath}dimensions/">${d.name}</a> — score: ${saved.dimensionScores[d.id].toFixed(1)}</li>`).join('')}
        </ul>
      </section>
      ` : ''}

      <div class="assess-actions mt-xl">
        <button class="assess-nav__btn assess-nav__btn--secondary" id="retake-from-results">Retake Assessment</button>
      </div>
    </div>
  `;

  // Render radar chart
  const chartEl = document.getElementById('radar-chart');
  if (chartEl) {
    renderRadarChart(
      dimensions.map(d => ({
        label: d.name,
        shortLabel: d.shortName,
        score: saved.dimensionScores[d.id] || 1,
      })),
      chartEl
    );
  }

  // Retake button
  document.getElementById('retake-from-results')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
}
