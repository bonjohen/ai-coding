/**
 * Matrix row expand/collapse on click.
 * Clicking a row toggles detail visibility for all cells in that row.
 */
export function initMatrix(): void {
  const matrixTable = document.querySelector('.matrix-table');
  if (!matrixTable) return;

  const rows = matrixTable.querySelectorAll('tbody tr[data-dimension]');
  rows.forEach(row => {
    const cells = row.querySelectorAll('.matrix-cell');
    const dimHeader = row.querySelector('.matrix-dimension-header') as HTMLElement;
    if (!dimHeader) return;

    // Make the whole row clickable
    (row as HTMLElement).style.cursor = 'pointer';
    dimHeader.setAttribute('role', 'button');
    dimHeader.setAttribute('aria-expanded', 'false');
    dimHeader.setAttribute('tabindex', '0');

    const toggle = () => {
      const isExpanded = row.classList.toggle('matrix-row--expanded');
      dimHeader.setAttribute('aria-expanded', String(isExpanded));
      cells.forEach(cell => {
        cell.classList.toggle('matrix-cell--expanded', isExpanded);
      });
    };

    row.addEventListener('click', toggle);
    dimHeader.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}
