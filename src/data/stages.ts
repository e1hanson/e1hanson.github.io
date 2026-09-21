// Дорожки и стадии проектов. Регламент — docs/PUBLISHING.md.

export const TRACKS = {
  digital: {
    label: 'Цифровой проект',
    stages: [
      { id: 'idea', label: 'Идея' },
      { id: 'prototype', label: 'Прототип' },
      { id: 'development', label: 'Разработка' },
      { id: 'beta', label: 'Бета' },
      { id: 'release', label: 'Релиз' },
      { id: 'support', label: 'Поддержка' },
    ],
  },
  architecture: {
    label: 'Здания и интерьеры',
    stages: [
      { id: 'concept', label: 'Концепция' },
      { id: 'sketch', label: 'Эскизный проект' },
      { id: 'documentation', label: 'Рабочая документация' },
      { id: 'construction', label: 'Реализация' },
      { id: 'completed', label: 'Завершён' },
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
