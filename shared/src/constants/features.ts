export const FEATURES = {
  CATEGORY: 'CATEGORY',
  MODEL: 'MODEL',
} as const;

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];
