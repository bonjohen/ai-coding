import { initNavigation } from './navigation.js';
import { initAccordions } from './accordions.js';
import { initMatrix } from './matrix.js';
import { initCitations } from './citations.js';
import { initFilters } from './filters.js';
import { initPageState } from './page-state.js';
import { initAssessment } from './self-assessment.js';
import { initQuiz } from './quiz-engine.js';

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
});
