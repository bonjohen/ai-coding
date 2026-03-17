/**
 * Optional page state persistence using localStorage.
 * Remembers expanded matrix rows and other UI state.
 */
export function initPageState(): void {
  restoreMatrixState();
}

function restoreMatrixState(): void {
  const matrixTable = document.querySelector('.matrix-table');
  if (!matrixTable) return;

  const stateKey = 'matrix-expanded-cells';

  // Save state on cell toggle
  matrixTable.addEventListener('click', (e) => {
    const summary = (e.target as Element).closest('.matrix-cell__summary');
    if (!summary) return;

    // Defer to let the toggle happen first
    requestAnimationFrame(() => {
      const expandedCells: string[] = [];
      matrixTable.querySelectorAll('.matrix-cell--expanded').forEach((cell, i) => {
        expandedCells.push(String(i));
      });
      try {
        localStorage.setItem(stateKey, JSON.stringify(expandedCells));
      } catch {
        // localStorage unavailable
      }
    });
  });

  // Restore state on load
  try {
    const saved = localStorage.getItem(stateKey);
    if (saved) {
      const indices = JSON.parse(saved) as string[];
      const cells = matrixTable.querySelectorAll('.matrix-cell');
      indices.forEach(idx => {
        const cell = cells[Number(idx)];
        if (cell) {
          cell.classList.add('matrix-cell--expanded');
          const summary = cell.querySelector('.matrix-cell__summary');
          if (summary) summary.setAttribute('aria-expanded', 'true');
        }
      });
    }
  } catch {
    // localStorage unavailable or corrupted
  }
}
