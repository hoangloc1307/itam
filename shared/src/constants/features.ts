export const FEATURES = {
  ATTRIBUTE_GROUP: 'ATTRIBUTE_GROUP',
  CATEGORY: 'CATEGORY',
  ATTRIBUTE: 'ATTRIBUTE',
  MODEL: 'MODEL',
  ROLE: 'ROLE',
  USER: 'USER',
  FEATURE: 'FEATURE',
} as const;

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];
