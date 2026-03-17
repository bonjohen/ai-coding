/**
 * Mobile nav toggle and active page highlighting.
 */
export function initNavigation(): void {
  const toggle = document.querySelector('.nav-toggle') as HTMLButtonElement | null;
  const nav = document.querySelector('.site-nav') as HTMLElement | null;

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('site-nav--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target as Node) && !toggle.contains(e.target as Node)) {
        nav.classList.remove('site-nav--open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close nav on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('site-nav--open')) {
        nav.classList.remove('site-nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Active page highlighting
  const currentPath = window.location.pathname.replace(/\/$/, '/');
  const navLinks = document.querySelectorAll('.site-nav__link');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href')?.replace(/\/$/, '/');
    if (href && currentPath === href) {
      link.classList.add('site-nav__link--active');
    }
  });
}
