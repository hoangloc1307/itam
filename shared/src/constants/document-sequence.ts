export const RESET_CYCLES = ['DAILY', 'MONTHLY', 'YEARLY', 'NEVER'] as const;
export type ResetCycle = (typeof RESET_CYCLES)[number];
