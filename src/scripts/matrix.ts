/**
 * Matrix dimension filtering and cell expand/collapse.
 */
export function initMatrix(): void {
  const matrixTable = document.querySelector('.matrix-table');
  if (!matrixTable) return;

  initDimensionFilters(matrixTable);
  initCellExpand(matrixTable);
}

function initDimensionFilters(container: Element): void {
  const rows = container.querySelectorAll('tbody tr[data-dimension]');
  if (rows.length === 0) return;

  // Build filter controls
  const dimensions = Array.from(rows).map(row => row.getAttribute('data-dimension')!);
  const uniqueDimensions = [...new Set(dimensions)];

  const filterContainer = document.createElement('div');
  filterContainer.className = 'matrix-filters flex flex-wrap gap-sm mb-lg';
  filterContainer.setAttribute('role', 'group');
  filterContainer.setAttribute('aria-label', 'Filter dimensions');

  // "Show All" button
  const showAll = document.createElement('button');
  showAll.textContent = 'Show All';
  showAll.className = 'matrix-filter-btn matrix-filter-btn--active';
  showAll.addEventListener('click', () => {
    rows.forEach(row => (row as HTMLElement).style.display = '');
    filterContainer.querySelectorAll('.matrix-filter-btn').forEach(btn => btn.classList.remove('matrix-filter-btn--active'));
    showAll.classList.add('matrix-filter-btn--active');
  });
  filterContainer.appendChild(showAll);

  // Build a map of dimension IDs to display names from the table cells
  const dimNames = new Map<string, string>();
  rows.forEach(row => {
    const dimId = row.getAttribute('data-dimension')!;
    const header = row.querySelector('.matrix-dimension-header');
    if (header) dimNames.set(dimId, header.textContent?.trim() || dimId);
  });

  // Per-dimension toggle buttons
  for (const dim of uniqueDimensions) {
    const btn = document.createElement('button');
    btn.textContent = dimNames.get(dim) || dim.replace('dim-', '').replace(/-/g, ' ');
    btn.className = 'matrix-filter-btn';
    btn.addEventListener('click', () => {
      rows.forEach(row => {
        (row as HTMLElement).style.display = row.getAttribute('data-dimension') === dim ? '' : 'none';
      });
      filterContainer.querySelectorAll('.matrix-filter-btn').forEach(b => b.classList.remove('matrix-filter-btn--active'));
      btn.classList.add('matrix-filter-btn--active');
    });
    filterContainer.appendChild(btn);
  }

  container.insertBefore(filterContainer, container.firstChild);
}

function initCellExpand(container: Element): void {
  const cells = container.querySelectorAll('.matrix-cell');
  cells.forEach(cell => {
    const detail = cell.querySelector('.matrix-cell__detail');
    if (!detail) return;

    const summary = cell.querySelector('.matrix-cell__summary') as HTMLElement;
    if (!summary) return;

    summary.style.cursor = 'pointer';
    summary.setAttribute('role', 'button');
    summary.setAttribute('aria-expanded', 'false');
    summary.setAttribute('tabindex', '0');

    const toggle = () => {
      const isExpanded = cell.classList.toggle('matrix-cell--expanded');
      summary.setAttribute('aria-expanded', String(isExpanded));
    };

    summary.addEventListener('click', toggle);
    summary.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}
