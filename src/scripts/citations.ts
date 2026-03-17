/**
 * Citation list expansion toggles.
 */
export function initCitations(): void {
  const citationLists = document.querySelectorAll('.citation-list');

  citationLists.forEach(list => {
    const title = list.querySelector('.citation-list__title') as HTMLElement | null;
    const content = list.querySelector('ul') as HTMLElement | null;

    if (!title || !content) return;

    // Start collapsed
    content.style.display = 'none';
    title.style.cursor = 'pointer';
    title.setAttribute('role', 'button');
    title.setAttribute('aria-expanded', 'false');
    title.setAttribute('tabindex', '0');

    const toggle = () => {
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? '' : 'none';
      title.setAttribute('aria-expanded', String(isHidden));
    };

    title.addEventListener('click', toggle);
    title.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}
