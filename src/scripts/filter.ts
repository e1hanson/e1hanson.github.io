// Фильтр каталога: дорожка, стадия, теги. Без JS каталог показывается целиком.

const form = document.querySelector<HTMLFormElement>('[data-project-filter]');

if (form) {
  const items = [...document.querySelectorAll<HTMLElement>('[data-project]')];
  const count = document.querySelector<HTMLElement>('[data-filter-count]');
  const empty = document.querySelector<HTMLElement>('[data-filter-empty]');
  const stageSelect = form.querySelector<HTMLSelectElement>('[name="stage"]');
  const tagButtons = [...form.querySelectorAll<HTMLButtonElement>('[data-tag]')];

  const plural = (n: number) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'проект';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'проекта';
    return 'проектов';
  };

  const apply = () => {
    const track = String(new FormData(form).get('track') ?? 'all');
    const tags = tagButtons.filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.dataset.tag ?? '');

    // Стадии чужой дорожки в списке не выбрать; если такая была выбрана — сбрасываем
    if (stageSelect) {
      for (const group of stageSelect.querySelectorAll('optgroup')) {
        group.disabled = track !== 'all' && group.dataset.track !== track;
      }
      const group = stageSelect.selectedOptions[0]?.parentElement;
      if (group instanceof HTMLOptGroupElement && group.disabled) stageSelect.value = 'all';
    }
    const activeStage = stageSelect?.value ?? 'all';

    let visible = 0;
    for (const item of items) {
      const itemTags = (item.dataset.tags ?? '').split('|').filter(Boolean);
      const match =
        (track === 'all' || item.dataset.track === track) &&
        (activeStage === 'all' || item.dataset.stage === activeStage) &&
        tags.every((tag) => itemTags.includes(tag));
      item.hidden = !match;
      if (match) visible += 1;
    }

    if (count) count.textContent = `Показано: ${visible} ${plural(visible)}`;
    if (empty) empty.hidden = visible > 0;
  };

  form.addEventListener('change', apply);
  form.addEventListener('submit', (event) => event.preventDefault());

  for (const button of tagButtons) {
    button.addEventListener('click', () => {
      button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
      apply();
    });
  }

  form.querySelector('[data-filter-reset]')?.addEventListener('click', () => {
    form.reset();
    for (const button of tagButtons) button.setAttribute('aria-pressed', 'false');
    apply();
  });

  apply();
}

export {};
