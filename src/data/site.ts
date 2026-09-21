export const SITE = {
  author: 'Иван',
  title: 'Иван — каталог проектов',
  description: 'Каталог проектов Ивана: от первой идеи до релиза, стадия за стадией.',
  lang: 'ru',
  // До релиза сайт закрыт от индексации; переключается на этапе 9 плана.
  released: false,
} as const;

export const NAV = [
  { href: '/', label: 'Главная' },
  { href: '/projects/', label: 'Проекты' },
  { href: '/about/', label: 'Обо мне' },
] as const;
