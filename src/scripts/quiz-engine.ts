/**
 * Practice quiz: configurable random questions with study link recommendations.
 */

interface Choice { value: number; label: string; }
interface StudyLink { label: string; href: string; }
interface Question {
  id: string;
  text: string;
  type: string;
  choices: Choice[];
  dimensionId: string;
  levelId: string;
  tags: string[];
  studyLinks: StudyLink[];
  explanation: string;
}
interface DimMeta { id: string; name: string; shortName: string; }
interface LevelMeta { id: string; title: string; shortLabel: string; levelNumber: number; slug: string; }
interface QuizAnswer { questionId: string; value: number; question: Question; }

const SEEN_KEY = 'ccc-quiz-seen';
const HISTORY_KEY = 'ccc-quiz-history';

function getSeenIds(): string[] {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { return []; }
}
function addSeenIds(ids: string[]): void {
  try {
    const seen = getSeenIds();
    const updated = [...new Set([...seen, ...ids])];
    localStorage.setItem(SEEN_KEY, JSON.stringify(updated.slice(-200)));
  } catch {}
}
function saveHistory(entry: Record<string, unknown>): void {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    history.push(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-50)));
  } catch {}
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function selectQuestions(bank: Question[], levelFilter: string, dimFilter: string, count: number): Question[] {
  let filtered = bank;
  if (levelFilter !== 'all') filtered = filtered.filter(q => q.levelId === levelFilter);
  if (dimFilter !== 'all') filtered = filtered.filter(q => q.dimensionId === dimFilter);

  const seen = new Set(getSeenIds());
  const unseen = filtered.filter(q => !seen.has(q.id));
  const seenQ = filtered.filter(q => seen.has(q.id));

  const ordered = [...shuffle(unseen), ...shuffle(seenQ)];
  return ordered.slice(0, count);
}

export function initQuiz(): void {
  const app = document.getElementById('quiz-app');
  if (!app) return;

  let questions: Question[];
  let dimensions: DimMeta[];
  let levels: LevelMeta[];
  try {
    questions = JSON.parse(document.getElementById('quiz-data')?.textContent || '[]');
    dimensions = JSON.parse(document.getElementById('quiz-dimensions')?.textContent || '[]');
    levels = JSON.parse(document.getElementById('quiz-levels')?.textContent || '[]');
  } catch { return; }

  if (questions.length === 0) return;
  renderConfig(app, questions, dimensions, levels);
}

function renderConfig(app: HTMLElement, bank: Question[], dims: DimMeta[], lvls: LevelMeta[]): void {
  app.innerHTML = `
    <div class="quiz-config">
      <h2>Configure Your Quiz</h2>
      <div class="quiz-config__grid">
        <div class="quiz-config__field">
          <label for="qcount">Questions</label>
          <select id="qcount" class="quiz-select">
            <option value="5">5 questions</option>
            <option value="10" selected>10 questions</option>
            <option value="15">15 questions</option>
            <option value="50">All questions</option>
          </select>
        </div>
        <div class="quiz-config__field">
          <label for="qlevel">Level</label>
          <select id="qlevel" class="quiz-select">
            <option value="all">All levels</option>
            ${lvls.sort((a,b) => a.levelNumber - b.levelNumber).map(l => `<option value="${l.id}">L${l.levelNumber}: ${l.shortLabel}</option>`).join('')}
          </select>
        </div>
        <div class="quiz-config__field">
          <label for="qdim">Dimension</label>
          <select id="qdim" class="quiz-select">
            <option value="all">All dimensions</option>
            ${dims.map(d => `<option value="${d.id}">${d.shortName}</option>`).join('')}
          </select>
        </div>
      </div>
      <button class="assess-nav__btn" id="start-quiz">Start Quiz</button>
    </div>
  `;

  document.getElementById('start-quiz')!.addEventListener('click', () => {
    const count = Number((document.getElementById('qcount') as HTMLSelectElement).value);
    const level = (document.getElementById('qlevel') as HTMLSelectElement).value;
    const dim = (document.getElementById('qdim') as HTMLSelectElement).value;
    const selected = selectQuestions(bank, level, dim, count);
    if (selected.length === 0) {
      app.innerHTML = '<p class="text-muted">No questions match your filters. Try different settings.</p><button class="assess-nav__btn mt-md" id="back-config">Back</button>';
      document.getElementById('back-config')!.addEventListener('click', () => renderConfig(app, bank, dims, lvls));
      return;
    }
    runQuiz(app, selected, bank, dims, lvls);
  });
}

function runQuiz(app: HTMLElement, questions: Question[], bank: Question[], dims: DimMeta[], lvls: LevelMeta[]): void {
  const answers: QuizAnswer[] = [];
  let idx = 0;

  function renderQuestion(): void {
    const q = questions[idx];
    const num = idx + 1;
    const total = questions.length;
    const pct = (num / total) * 100;

    app.innerHTML = `
      <div class="assess-progress"><div class="assess-progress__bar" style="width:${pct}%"></div></div>
      <p class="assess-progress__label">Question ${num} of ${total}</p>
      <div class="quiz-question">
        <p class="quiz-question__text">${q.text}</p>
        <div class="quiz-question__type"><span class="badge">${q.type}</span></div>
        <div class="assess-choices">
          ${q.choices.map(c => `
            <button class="assess-choice" data-value="${c.value}">
              <span class="assess-choice__value">${c.value}</span>
              <span class="assess-choice__label">${c.label}</span>
            </button>
          `).join('')}
        </div>
        <div id="quiz-feedback" class="hidden"></div>
      </div>
    `;

    app.querySelectorAll('.assess-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = Number(btn.getAttribute('data-value')!);
        answers.push({ questionId: q.id, value: val, question: q });

        // Highlight selection
        app.querySelectorAll('.assess-choice').forEach(b => {
          b.classList.remove('assess-choice--selected');
          (b as HTMLButtonElement).disabled = true;
        });
        btn.classList.add('assess-choice--selected');

        // Show feedback
        const fb = document.getElementById('quiz-feedback')!;
        fb.classList.remove('hidden');
        fb.innerHTML = `
          <div class="quiz-feedback">
            <p class="quiz-feedback__explanation">${q.explanation}</p>
            ${q.studyLinks.length > 0 ? `
              <div class="quiz-feedback__links">
                <strong>Study:</strong>
                ${q.studyLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join(' · ')}
              </div>
            ` : ''}
            <button class="assess-nav__btn mt-md" id="quiz-next">
              ${idx < questions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          </div>
        `;

        document.getElementById('quiz-next')!.addEventListener('click', () => {
          idx++;
          if (idx < questions.length) {
            renderQuestion();
          } else {
            showResults(app, answers, bank, dims, lvls);
          }
        });
      });
    });
  }

  renderQuestion();
}

function showResults(app: HTMLElement, answers: QuizAnswer[], bank: Question[], dims: DimMeta[], lvls: LevelMeta[]): void {
  // Track seen questions
  addSeenIds(answers.map(a => a.questionId));

  // Compute per-dimension scores
  const dimScores = new Map<string, { total: number; count: number }>();
  for (const a of answers) {
    const d = a.question.dimensionId;
    const curr = dimScores.get(d) || { total: 0, count: 0 };
    curr.total += a.value;
    curr.count++;
    dimScores.set(d, curr);
  }

  const avgScore = answers.reduce((s, a) => s + a.value, 0) / answers.length;

  // Collect study links, weighted by low scores
  const linkCounts = new Map<string, { link: StudyLink; count: number }>();
  for (const a of answers) {
    if (a.value <= 2) {
      for (const link of a.question.studyLinks) {
        const key = link.href;
        const curr = linkCounts.get(key) || { link, count: 0 };
        curr.count++;
        linkCounts.set(key, curr);
      }
    }
  }
  const rankedLinks = [...linkCounts.values()].sort((a, b) => b.count - a.count).slice(0, 8);

  // Identify weak dimensions
  const dimResults = [...dimScores.entries()].map(([id, { total, count }]) => {
    const dim = dims.find(d => d.id === id);
    return { id, name: dim?.shortName || id, avg: total / count };
  }).sort((a, b) => a.avg - b.avg);

  // Save history
  saveHistory({
    completedAt: new Date().toISOString(),
    questionCount: answers.length,
    averageScore: Math.round(avgScore * 100) / 100,
    dimensionScores: Object.fromEntries(dimResults.map(d => [d.id, Math.round(d.avg * 100) / 100])),
  });

  app.innerHTML = `
    <div class="quiz-results">
      <h2>Quiz Results</h2>
      <p class="text-lg mb-lg">Average score: <strong>${avgScore.toFixed(1)}</strong> / 4.0 across ${answers.length} questions</p>

      ${dimResults.length > 0 ? `
      <section class="section">
        <h3>Dimension Scores</h3>
        <div class="assess-dim-grid">
          ${dimResults.map(d => {
            const pct = (d.avg / 4) * 100;
            const tier = d.avg < 2.5 ? 'weak' : d.avg < 3.0 ? 'developing' : 'strong';
            return `
              <div class="assess-dim-card assess-dim-card--${tier}">
                <div class="assess-dim-card__header">
                  <span class="assess-dim-card__name">${d.name}</span>
                  <span class="assess-dim-card__score">${d.avg.toFixed(1)}</span>
                </div>
                <div class="assess-dim-card__bar"><div class="assess-dim-card__fill" style="width:${pct}%"></div></div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
      ` : ''}

      ${rankedLinks.length > 0 ? `
      <section class="section">
        <h3>Recommended Study</h3>
        <p class="text-muted mb-md">Based on your lower-scoring answers:</p>
        <ul>
          ${rankedLinks.map(r => `<li><a href="${r.link.href}">${r.link.label}</a></li>`).join('')}
        </ul>
      </section>
      ` : `
      <section class="section">
        <p class="text-muted">Great work — no weak areas identified!</p>
      </section>
      `}

      <div class="flex gap-md mt-xl">
        <button class="assess-nav__btn" id="quiz-restart">Take Another Quiz</button>
      </div>
    </div>
  `;

  document.getElementById('quiz-restart')!.addEventListener('click', () => {
    location.reload();
  });
}
