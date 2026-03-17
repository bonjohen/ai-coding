/**
 * Study guide: reads localStorage from assessment and quiz, renders
 * personalized recommendations.
 */

interface DimMeta { id: string; name: string; shortName: string; slug: string; }
interface LevelMeta { id: string; title: string; shortLabel: string; levelNumber: number; slug: string; }

const ASSESS_KEY = 'ccc-assessment';
const QUIZ_KEY = 'ccc-quiz-history';

function getAssessment(): { dimensionScores: Record<string, number>; estimatedLevel: number } | null {
  try { return JSON.parse(localStorage.getItem(ASSESS_KEY) || 'null'); } catch { return null; }
}

function getQuizHistory(): Array<{ dimensionScores: Record<string, number>; averageScore: number }> {
  try { return JSON.parse(localStorage.getItem(QUIZ_KEY) || '[]'); } catch { return []; }
}

export function initStudyGuide(): void {
  const app = document.getElementById('study-guide-app');
  if (!app) return;

  let dims: DimMeta[];
  let levels: LevelMeta[];
  try {
    dims = JSON.parse(document.getElementById('study-dimensions')?.textContent || '[]');
    levels = JSON.parse(document.getElementById('study-levels')?.textContent || '[]');
  } catch { return; }

  const assessment = getAssessment();
  const quizHistory = getQuizHistory();

  if (!assessment && quizHistory.length === 0) {
    renderEmptyState(app);
    return;
  }

  renderRecommendations(app, assessment, quizHistory, dims, levels);
}

function renderEmptyState(app: HTMLElement): void {
  const basePath = getBasePath();
  app.innerHTML = `
    <div class="study-empty">
      <h2>No Data Yet</h2>
      <p class="text-muted mb-lg">Take an assessment or quiz to get personalized study recommendations.</p>
      <div class="flex gap-md">
        <a href="${basePath}assess/" class="assess-nav__btn" style="text-decoration:none;">Take Assessment</a>
        <a href="${basePath}quiz/" class="assess-nav__btn assess-nav__btn--secondary" style="text-decoration:none;">Practice Quiz</a>
      </div>
    </div>
  `;
}

function getBasePath(): string {
  const canon = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  const match = canon.match(/\/ai-coding\/claude-code-competence\//);
  return match ? '/ai-coding/claude-code-competence/' : '/ai-coding/claude-code-competence/';
}

function renderRecommendations(
  app: HTMLElement,
  assessment: { dimensionScores: Record<string, number>; estimatedLevel: number } | null,
  quizHistory: Array<{ dimensionScores: Record<string, number>; averageScore: number }>,
  dims: DimMeta[],
  levels: LevelMeta[]
): void {
  const basePath = getBasePath();

  // Merge dimension scores from assessment and latest quiz
  const mergedScores: Record<string, number[]> = {};
  if (assessment) {
    for (const [id, score] of Object.entries(assessment.dimensionScores)) {
      mergedScores[id] = mergedScores[id] || [];
      mergedScores[id].push(score);
    }
  }
  if (quizHistory.length > 0) {
    const latest = quizHistory[quizHistory.length - 1];
    for (const [id, score] of Object.entries(latest.dimensionScores)) {
      mergedScores[id] = mergedScores[id] || [];
      mergedScores[id].push(score);
    }
  }

  const avgScores: Array<{ dim: DimMeta; avg: number }> = [];
  for (const dim of dims) {
    const scores = mergedScores[dim.id];
    if (scores && scores.length > 0) {
      avgScores.push({ dim, avg: scores.reduce((a, b) => a + b, 0) / scores.length });
    }
  }
  avgScores.sort((a, b) => a.avg - b.avg);

  const priority = avgScores.filter(d => d.avg < 2.5);
  const developing = avgScores.filter(d => d.avg >= 2.5 && d.avg < 3.0);
  const strong = avgScores.filter(d => d.avg >= 3.0);

  const estLevel = assessment?.estimatedLevel || Math.round(
    (quizHistory.length > 0 ? quizHistory[quizHistory.length - 1].averageScore : 2) * 1.25
  );
  const levelInfo = levels.find(l => l.levelNumber === estLevel) || levels[0];
  const nextLevel = levels.find(l => l.levelNumber === estLevel + 1);

  app.innerHTML = `
    <section class="section">
      <h2>Your Position</h2>
      <div class="study-position">
        <span class="badge badge--level-${estLevel}">Level ${estLevel}</span>
        <span class="study-position__name">${levelInfo.title}</span>
      </div>
      <p class="text-muted mt-sm">
        <a href="${basePath}levels/${levelInfo.slug}/">Review Level ${estLevel} details</a>
        ${nextLevel ? ` · <a href="${basePath}levels/${nextLevel.slug}/">See what Level ${estLevel + 1} requires</a>` : ''}
      </p>
    </section>

    ${priority.length > 0 ? `
    <section class="section">
      <h2>Priority: Focus Here</h2>
      <p class="text-muted mb-md">These dimensions scored below 2.5 — focused study will have the most impact.</p>
      ${priority.map(d => renderDimRec(d, basePath)).join('')}
    </section>
    ` : ''}

    ${developing.length > 0 ? `
    <section class="section">
      <h2>Developing: Good Progress</h2>
      ${developing.map(d => renderDimRec(d, basePath)).join('')}
    </section>
    ` : ''}

    ${strong.length > 0 ? `
    <section class="section">
      <h2>Strong: Keep It Up</h2>
      ${strong.map(d => renderDimRec(d, basePath)).join('')}
    </section>
    ` : ''}

    <section class="section">
      <h2>Recommended Next Steps</h2>
      <ul>
        ${priority.length > 0 ? `<li>Focus on <strong>${priority[0].dim.name}</strong> — your weakest dimension. <a href="${basePath}dimensions/">Study dimensions</a></li>` : ''}
        ${nextLevel ? `<li>Review <a href="${basePath}levels/${nextLevel.slug}/">Level ${nextLevel.levelNumber}: ${nextLevel.title}</a> graduation criteria</li>` : ''}
        <li><a href="${basePath}quiz/">Take another quiz</a> to track improvement</li>
        <li><a href="${basePath}projects/">Try an example project</a> at your level</li>
      </ul>
    </section>

    <div class="flex gap-md mt-xl">
      <a href="${basePath}assess/" class="assess-nav__btn assess-nav__btn--secondary" style="text-decoration:none;">Retake Assessment</a>
      <a href="${basePath}quiz/" class="assess-nav__btn assess-nav__btn--secondary" style="text-decoration:none;">Practice Quiz</a>
    </div>
  `;
}

function renderDimRec(d: { dim: DimMeta; avg: number }, basePath: string): string {
  const pct = (d.avg / 4) * 100;
  const tier = d.avg < 2.5 ? 'weak' : d.avg < 3.0 ? 'developing' : 'strong';
  return `
    <div class="assess-dim-card assess-dim-card--${tier} mb-sm">
      <div class="assess-dim-card__header">
        <a href="${basePath}dimensions/" class="assess-dim-card__name">${d.dim.name}</a>
        <span class="assess-dim-card__score">${d.avg.toFixed(1)}</span>
      </div>
      <div class="assess-dim-card__bar"><div class="assess-dim-card__fill" style="width:${pct}%"></div></div>
    </div>
  `;
}
