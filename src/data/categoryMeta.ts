import type { Category } from './clubs';

export interface CategoryMeta {
  /** English display label */
  en: string;
  /** Chinese display label */
  cn: string;
  /** Short editorial tagline */
  tagline: string;
  /** Accent color (hex) used for chips, glows and rings */
  accent: string;
}

/**
 * Per-category presentation metadata. Each category gets its own accent so the
 * gallery reads as a curated, color-coded wall rather than a flat list.
 */
export const categoryMeta: Record<Category, CategoryMeta> = {
  Sports: {
    en: 'Sports',
    cn: '运动',
    tagline: 'Move, compete, belong.',
    accent: '#34d399',
  },
  Arts: {
    en: 'Arts',
    cn: '艺术',
    tagline: 'Create without limits.',
    accent: '#c084fc',
  },
  Service: {
    en: 'Service',
    cn: '服务',
    tagline: 'Lead, give, connect.',
    accent: '#38bdf8',
  },
  Life: {
    en: 'Life',
    cn: '生活',
    tagline: 'Find your people.',
    accent: '#fbbf24',
  },
  Academic: {
    en: 'Academic',
    cn: '学术',
    tagline: 'Think deeper, reach further.',
    accent: '#2dd4bf',
  },
  ClubsToBeEstablished: {
    en: 'Forming',
    cn: '即将成立',
    tagline: 'The next chapter, written by you.',
    accent: '#d8b46a',
  },
};

const FALLBACK: CategoryMeta = {
  en: 'Clubs',
  cn: '社团',
  tagline: 'Discover your community.',
  accent: '#2dd4a7',
};

export function getCategoryMeta(category: string): CategoryMeta {
  return categoryMeta[category as Category] ?? FALLBACK;
}
