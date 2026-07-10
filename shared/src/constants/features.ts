export const FEATURES = {
  CATEGORY: 'CATEGORY',
  ATTRIBUTE: 'ATTRIBUTE',
  MODEL: 'MODEL',
  USER: 'USER',
} as const;

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];
