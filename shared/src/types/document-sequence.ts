export type ResetCycle = 'DAILY' | 'MONTHLY' | 'YEARLY' | 'NEVER';

export interface DocumentSequenceBase<TDate = string> {
  id: number;
  code: string;
  name: string;
  prefix: string;
  separator: string;
  dateFormat: string;
  paddingLength: number;
  resetCycle: string;
  isActive: boolean;
  deletedAt: TDate | null;
  createdBy: string;
  createdAt: TDate;
  updatedBy: string | null;
  updatedAt: TDate | null;
}

/** FE type — dates as ISO strings */
export type DocumentSequence = DocumentSequenceBase<string> & {
  currentNumber?: number;
  lastCode?: string | null;
  periodKey?: string;
};

/** BE type — dates as Date objects (from Prisma) */
export type DocumentSequenceEntity = DocumentSequenceBase<Date> & {
  currentNumber?: number;
  lastCode?: string | null;
  periodKey?: string;
};

/** Preview response when generating a code */
export interface GenerateCodeResponse {
  code: string;
  nextNumber: number;
}
