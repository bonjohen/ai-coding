/**
 * Expand/collapse accordion blocks.
 * Works on elements with class "accordion".
 */
export function initAccordions(): void {
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach((accordion) => {
    const trigger = accordion.querySelector('.accordion__trigger') as HTMLButtonElement | null;
    const content = accordion.querySelector('.accordion__content') as HTMLElement | null;

    if (!trigger || !content) return;

    const contentId = content.id || `accordion-${Math.random().toString(36).slice(2, 9)}`;
    content.id = contentId;
    trigger.setAttribute('aria-controls', contentId);
    trigger.setAttribute('aria-expanded', accordion.classList.contains('accordion--open') ? 'true' : 'false');
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', trigger.id || '');

    trigger.addEventListener('click', () => {
      const isOpen = accordion.classList.toggle('accordion--open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });
}
