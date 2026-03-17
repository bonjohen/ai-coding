import { initNavigation } from './navigation.js';
import { initAccordions } from './accordions.js';
import { initMatrix } from './matrix.js';
import { initCitations } from './citations.js';
import { initFilters } from './filters.js';
import { initPageState } from './page-state.js';
import { initAssessment } from './self-assessment.js';
import { initQuiz } from './quiz-engine.js';
import { initStudyGuide } from './study-guide.js';
import { initCertQuiz } from './cert-app.js';

/**
 * Initialize all browser enhancements.
 * All content remains readable without JavaScript (progressive enhancement).
 */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccordions();
  initMatrix();
  initCitations();
  initFilters();
  initPageState();
  initAssessment();
  initQuiz();
  initStudyGuide();
  initCertQuiz();
  initYourLevel();
});

function initYourLevel(): void {
  const container = document.getElementById('your-level-indicator');
  const text = document.getElementById('your-level-text');
  if (!container || !text) return;

  try {
    const raw = localStorage.getItem('ccc-assessment');
    if (!raw) return;
    const data = JSON.parse(raw);
    const scores: number[] = Object.values(data.dimensionScores || {});
    if (scores.length === 0) return;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    let level: string;
    if (avg < 1.5) level = 'Level 1: Operator';
    else if (avg < 2.25) level = 'Level 2: Structured Collaborator';
    else if (avg < 3.0) level = 'Level 3: Environment Builder';
    else if (avg < 3.5) level = 'Level 4: Workflow Engineer';
    else level = 'Level 5: Agentic Systems Expert';

    text.textContent = level;
    container.style.display = '';
  } catch { /* ignore parse errors */ }
}
