// Мобильное меню. Без JS навигация просто видна целиком (сворачивание включается классом .js).

const button = document.querySelector<HTMLButtonElement>('[data-menu-button]');
const nav = document.querySelector<HTMLElement>('[data-menu]');
const desktop = matchMedia('(min-width: 768px)');

if (button && nav) {
  const setOpen = (open: boolean) => {
    button.setAttribute('aria-expanded', String(open));
    nav.toggleAttribute('data-open', open);
  };

  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (button.getAttribute('aria-expanded') !== 'true') return;
    const target = event.target instanceof Node ? event.target : null;
    if (target && !nav.contains(target) && !button.contains(target)) setOpen(false);
  });

  desktop.addEventListener('change', () => setOpen(false));
}

export {};
