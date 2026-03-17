/**
 * General filter support for list pages (glossary, sources).
 * Adds a text filter input above any element with [data-filterable].
 */
export function initFilters(): void {
  const filterables = document.querySelectorAll('[data-filterable]');

  filterables.forEach(container => {
    const items = container.querySelectorAll('[data-filter-text]');
    if (items.length < 5) return; // Don't add filter for very short lists

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Filter...';
    input.className = 'filter-input';
    input.setAttribute('aria-label', 'Filter items');

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      items.forEach(item => {
        const text = item.getAttribute('data-filter-text')?.toLowerCase() || '';
        (item as HTMLElement).style.display = !query || text.includes(query) ? '' : 'none';
      });
    });

    container.parentElement?.insertBefore(input, container);
  });
}
