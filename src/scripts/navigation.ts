/**
 * Mobile nav toggle, dropdown menus, and active page highlighting.
 */
export function initNavigation(): void {
  const toggle = document.querySelector('.nav-toggle') as HTMLButtonElement | null;
  const nav = document.querySelector('.site-nav') as HTMLElement | null;

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('site-nav--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target as Node) && !toggle.contains(e.target as Node)) {
        nav.classList.remove('site-nav--open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('site-nav--open')) {
        nav.classList.remove('site-nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Dropdown menus
  document.querySelectorAll<HTMLElement>('.nav-dropdown').forEach((dropdown) => {
    const toggleEl = dropdown.querySelector<HTMLElement>('.nav-dropdown__toggle');
    if (!toggleEl) return;

    // Desktop: toggle on click of the caret area; navigate on link click
    toggleEl.addEventListener('click', (e) => {
      // If click was on the caret span, toggle; otherwise navigate (default link behavior)
      const caret = toggleEl.querySelector('.nav-dropdown__caret');
      if (caret && (caret as HTMLElement).contains(e.target as Node)) {
        e.preventDefault();
        toggleDropdown(dropdown);
        return;
      }
      // On mobile (nav is flex-column), toggle instead of navigating
      if (nav && getComputedStyle(nav).flexDirection === 'column') {
        e.preventDefault();
        toggleDropdown(dropdown);
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target as Node)) {
        closeDropdown(dropdown);
      }
    });

    // Close on Escape
    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown(dropdown);
    });
  });

  // Active page highlighting — mark links and parent dropdowns
  const currentPath = window.location.pathname;
  document.querySelectorAll<HTMLAnchorElement>('.site-nav__link, .nav-dropdown__item').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && currentPath.startsWith(href) && href !== '/ai-coding/') {
      link.classList.add('site-nav__link--active');
      // Also mark the parent dropdown toggle as active
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
        parentDropdown.querySelector('.nav-dropdown__toggle')?.classList.add('site-nav__link--active');
      }
    }
  });
}

function toggleDropdown(dropdown: HTMLElement): void {
  const isOpen = dropdown.classList.toggle('nav-dropdown--open');
  dropdown.querySelector('.nav-dropdown__toggle')?.setAttribute('aria-expanded', String(isOpen));
}

function closeDropdown(dropdown: HTMLElement): void {
  dropdown.classList.remove('nav-dropdown--open');
  dropdown.querySelector('.nav-dropdown__toggle')?.setAttribute('aria-expanded', 'false');
}
