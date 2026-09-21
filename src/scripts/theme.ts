// Тема: по умолчанию как на устройстве; ручной выбор хранится в localStorage.
// Первичная установка data-theme — инлайн-скриптом в <head> (без вспышки), здесь — переключение.

type Theme = 'light' | 'dark';

const KEY = 'theme';
const THEME_COLOR: Record<Theme, string> = { light: '#e7ebf0', dark: '#23262b' };

const root = document.documentElement;
const systemDark = matchMedia('(prefers-color-scheme: dark)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Запасное хранилище на случай, когда localStorage недоступен (приватный режим)
let memory: Theme | null = null;

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

function stored(): Theme | null {
  try {
    const value = localStorage.getItem(KEY);
    return isTheme(value) ? value : null;
  } catch {
    return memory;
  }
}

function save(theme: Theme | null) {
  memory = theme;
  try {
    if (theme) localStorage.setItem(KEY, theme);
    else localStorage.removeItem(KEY);
  } catch {
    /* остаётся выбор в памяти вкладки */
  }
}

function effective(): Theme {
  return stored() ?? (systemDark.matches ? 'dark' : 'light');
}

function render() {
  const manual = stored();
  if (manual) root.dataset.theme = manual;
  else delete root.dataset.theme;

  const isDark = effective() === 'dark';
  for (const el of document.querySelectorAll('[data-theme-switch]')) {
    el.setAttribute('aria-checked', String(isDark));
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-theme-reset]')) el.hidden = !manual;
  for (const el of document.querySelectorAll<HTMLElement>('[data-theme-auto-note]')) el.hidden = Boolean(manual);

  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    const own = meta.dataset.scheme;
    meta.content = manual ? THEME_COLOR[manual] : isTheme(own) ? THEME_COLOR[own] : THEME_COLOR.light;
  }
}

function commit(next: Theme | null, origin?: Element) {
  const apply = () => {
    save(next);
    render();
  };

  const canAnimate = 'startViewTransition' in document && !reducedMotion.matches && origin;
  if (!canAnimate) {
    apply();
    return;
  }

  // Круговое раскрытие новой темы от переключателя
  const rect = origin.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  root.classList.add('theme-switching');
  const transition = document.startViewTransition(apply);
  transition.ready
    .then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 377, easing: 'cubic-bezier(0.382, 0, 0.236, 1)', pseudoElement: '::view-transition-new(root)' },
      ),
    )
    .catch(() => {});
  transition.finished.finally(() => root.classList.remove('theme-switching'));
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const toggle = target?.closest('[data-theme-switch]');
  if (toggle) {
    commit(effective() === 'dark' ? 'light' : 'dark', toggle);
    return;
  }
  const reset = target?.closest('[data-theme-reset]');
  if (reset) commit(null, reset);
});

// Системная тема сменилась, ручного выбора нет — следуем за устройством
systemDark.addEventListener('change', () => {
  if (!stored()) render();
});

// Синхронизация между вкладками
addEventListener('storage', (event) => {
  if (event.key === KEY || event.key === null) render();
});

// Возврат из кэша «назад/вперёд»: выбор мог измениться на другой странице
addEventListener('pageshow', render);

render();

export {};
