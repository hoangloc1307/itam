export const FEATURES = {
  CATEGORY: 'CATEGORY',
  ATTRIBUTE: 'ATTRIBUTE',
  MODEL: 'MODEL',
} as const;

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];
