// Дорожки и стадии проектов. Регламент — docs/PUBLISHING.md.

export const TRACKS = {
  digital: {
    label: 'Цифровые проекты',
    stages: [
      { id: 'idea', label: 'Идея', note: 'Задача, для кого она и зачем.' },
      { id: 'prototype', label: 'Прототип', note: 'Первая рабочая проверка идеи.' },
      { id: 'development', label: 'Разработка', note: 'Основная сборка проекта.' },
      { id: 'beta', label: 'Бета', note: 'Проект работает, идёт проверка и доводка.' },
      { id: 'release', label: 'Релиз', note: 'Проект опубликован и доступен.' },
      { id: 'support', label: 'Поддержка', note: 'Исправления и развитие после релиза.' },
    ],
  },
  architecture: {
    label: 'Здания и интерьеры',
    stages: [
      { id: 'concept', label: 'Концепция', note: 'Идея объекта, образ и основные решения.' },
      { id: 'sketch', label: 'Эскизный проект', note: 'Планировки, объёмы, визуализации.' },
      { id: 'documentation', label: 'Рабочая документация', note: 'Чертежи и спецификации для реализации.' },
      { id: 'construction', label: 'Реализация', note: 'Строительство или отделка, авторский надзор.' },
      { id: 'completed', label: 'Завершён', note: 'Объект готов.' },
    ],
  },
} as const;

export type TrackId = keyof typeof TRACKS;
export type StageId = (typeof TRACKS)[TrackId]['stages'][number]['id'];

export const TRACK_IDS = ['digital', 'architecture'] as const satisfies readonly TrackId[];

export const STAGE_IDS = [
  'idea',
  'prototype',
  'development',
  'beta',
  'release',
  'support',
  'concept',
  'sketch',
  'documentation',
  'construction',
  'completed',
] as const satisfies readonly StageId[];

export function stagesOf(track: TrackId) {
  return TRACKS[track].stages;
}

export function stageBelongsTo(track: TrackId, stage: StageId) {
  return stagesOf(track).some((s) => s.id === stage);
}

export function stageIndex(track: TrackId, stage: StageId) {
  return stagesOf(track).findIndex((s) => s.id === stage);
}

export function stageLabel(stage: StageId) {
  for (const track of TRACK_IDS) {
    const found = stagesOf(track).find((s) => s.id === stage);
    if (found) return found.label;
  }
  return stage;
}

export function isFinalStage(track: TrackId, stage: StageId) {
  const stages = stagesOf(track);
  const finalIds: StageId[] = track === 'digital' ? ['release', 'support'] : [stages[stages.length - 1].id];
  return finalIds.includes(stage);
}

/*
  Плитка Фибоначчи: стадии — квадраты 1·1·2·3·5(·8), вместе — золотой прямоугольник.
  Проект растёт стадия за стадией, как ряд Фибоначчи.
  area — линии CSS-сетки «строка / колонка / строка / колонка»;
  arc — четверть окружности золотой спирали внутри квадрата (SVG: радиус и конечная точка).
*/
export const TILINGS = {
  digital: {
    cols: 13,
    rows: 8,
    start: [10, 6],
    tiles: [
      { area: '6 / 10 / 7 / 11', size: 1, arc: { r: 1, to: [9, 5] } },
      { area: '6 / 9 / 7 / 10', size: 1, arc: { r: 1, to: [8, 6] } },
      { area: '7 / 9 / 9 / 11', size: 2, arc: { r: 2, to: [10, 8] } },
      { area: '6 / 11 / 9 / 14', size: 3, arc: { r: 3, to: [13, 5] } },
      { area: '1 / 9 / 6 / 14', size: 5, arc: { r: 5, to: [8, 0] } },
      { area: '1 / 1 / 9 / 9', size: 8, arc: { r: 8, to: [0, 8] } },
    ],
  },
  architecture: {
    cols: 8,
    rows: 5,
    start: [6, 3],
    tiles: [
      { area: '4 / 6 / 5 / 7', size: 1, arc: { r: 1, to: [5, 4] } },
      { area: '5 / 6 / 6 / 7', size: 1, arc: { r: 1, to: [6, 5] } },
      { area: '4 / 7 / 6 / 9', size: 2, arc: { r: 2, to: [8, 3] } },
      { area: '1 / 6 / 4 / 9', size: 3, arc: { r: 3, to: [5, 0] } },
      { area: '1 / 1 / 6 / 6', size: 5, arc: { r: 5, to: [0, 5] } },
    ],
  },
} as const;
