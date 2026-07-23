import type {
  CreateDocumentSequenceInput,
  UpdateDocumentSequenceInput,
} from 'itam-shared/schemas/document-sequence';
import { format } from 'date-fns';
import { prisma } from '~/lib/prisma';
import { AppError } from '~/errors';
import { t } from '~/i18n';

interface ListParams {
  search?: string;
}

const list = async ({ search }: ListParams) => {
  const where = {
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { code: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const sequences = await prisma.documentSequence.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  // Attach current counter info for each sequence
  const now = new Date();
  const result = await Promise.all(
    sequences.map(async (seq) => {
      const periodKey = buildPeriodKey(seq.resetCycle, now);
      const counter = await prisma.documentSequenceCounter.findUnique({
        where: { sequenceId_periodKey: { sequenceId: seq.id, periodKey } },
      });

      const lastNumber = counter?.lastNumber ?? 0;

      // Build last generated code
      let lastCode: string | null = null;
      if (lastNumber > 0) {
        const parts: string[] = [];
        if (seq.prefix) parts.push(seq.prefix);
        const datePart = applyDateFormat(now, seq.dateFormat);
        if (datePart) parts.push(datePart);
        parts.push(String(lastNumber).padStart(seq.paddingLength, '0'));
        lastCode = parts.join(seq.separator);
      }

      return {
        ...seq,
        currentNumber: lastNumber,
        lastCode,
        periodKey,
      };
    }),
  );

  return result;
};

const getById = async (id: number) => {
  const sequence = await prisma.documentSequence.findUnique({
    where: { id, deletedAt: null },
  });

  if (!sequence) {
    throw AppError.notFound(t('documentSequence:notFound'));
  }

  return sequence;
};

const getByCode = async (code: string) => {
  const sequence = await prisma.documentSequence.findUnique({
    where: { code, deletedAt: null },
  });

  if (!sequence) {
    throw AppError.notFound(t('documentSequence:notFound'));
  }

  return sequence;
};

const create = async (input: CreateDocumentSequenceInput, createdBy: string) => {
  const existing = await prisma.documentSequence.findUnique({
    where: { code: input.code },
  });

  if (existing && !existing.deletedAt) {
    throw AppError.conflict(t('documentSequence:alreadyExists'));
  }

  if (existing && existing.deletedAt) {
    return prisma.documentSequence.update({
      where: { id: existing.id },
      data: {
        name: input.name,
        prefix: input.prefix,
        separator: input.separator,
        dateFormat: input.dateFormat,
        paddingLength: input.paddingLength,
        resetCycle: input.resetCycle,
        isActive: input.isActive,
        deletedAt: null,
        createdBy,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: null,
      },
    });
  }

  return prisma.documentSequence.create({
    data: {
      code: input.code,
      name: input.name,
      prefix: input.prefix,
      separator: input.separator,
      dateFormat: input.dateFormat,
      paddingLength: input.paddingLength,
      resetCycle: input.resetCycle,
      isActive: input.isActive,
      createdBy,
    },
  });
};

const update = async (id: number, input: UpdateDocumentSequenceInput, updatedBy: string) => {
  const existing = await prisma.documentSequence.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw AppError.notFound(t('documentSequence:notFound'));
  }

  return prisma.documentSequence.update({
    where: { id },
    data: {
      ...input,
      updatedBy,
      updatedAt: new Date(),
    },
  });
};

const remove = async (id: number) => {
  const existing = await prisma.documentSequence.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw AppError.notFound(t('documentSequence:notFound'));
  }

  return prisma.documentSequence.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

function buildPeriodKey(resetCycle: string, date: Date = new Date()): string {
  switch (resetCycle) {
    case 'DAILY':
      return format(date, 'yyyyMMdd');
    case 'MONTHLY':
      return format(date, 'yyyyMM');
    case 'YEARLY':
      return format(date, 'yyyy');
    case 'NEVER':
    default:
      return 'ALL';
  }
}

function applyDateFormat(date: Date, pattern: string): string {
  if (!pattern) return '';

  return pattern
    .replace(/YYYY/g, format(date, 'yyyy'))
    .replace(/YY/g, format(date, 'yy'))
    .replace(/MM/g, format(date, 'MM'))
    .replace(/DD/g, format(date, 'dd'));
}

const generateCode = async (sequenceCode: string) => {
  const sequence = await prisma.documentSequence.findUnique({
    where: { code: sequenceCode, deletedAt: null },
  });

  if (!sequence) {
    throw AppError.notFound(t('documentSequence:notFound'));
  }

  if (!sequence.isActive) {
    throw AppError.badRequest(t('documentSequence:inactive'));
  }

  const now = new Date();
  const periodKey = buildPeriodKey(sequence.resetCycle, now);

  // Atomic increment using raw SQL to prevent race conditions
  const result = await prisma.$queryRaw<{ last_number: number }[]>`
    INSERT INTO document_sequence_counters (sequence_id, period_key, last_number, updated_at)
    VALUES (${sequence.id}, ${periodKey}, 1, NOW())
    ON CONFLICT (sequence_id, period_key)
    DO UPDATE SET last_number = document_sequence_counters.last_number + 1, updated_at = NOW()
    RETURNING last_number
  `;

  const nextNumber = result[0].last_number;

  // Build the code
  const parts: string[] = [];
  if (sequence.prefix) parts.push(sequence.prefix);

  const datePart = applyDateFormat(now, sequence.dateFormat);
  if (datePart) parts.push(datePart);

  parts.push(String(nextNumber).padStart(sequence.paddingLength, '0'));

  return {
    code: parts.join(sequence.separator),
    nextNumber,
  };
};

const previewCode = async (sequenceCode: string) => {
  const sequence = await prisma.documentSequence.findUnique({
    where: { code: sequenceCode, deletedAt: null },
  });

  if (!sequence) {
    throw AppError.notFound(t('documentSequence:notFound'));
  }

  const now = new Date();

  const parts: string[] = [];
  if (sequence.prefix) parts.push(sequence.prefix);

  const datePart = applyDateFormat(now, sequence.dateFormat);
  if (datePart) parts.push(datePart);

  parts.push('x'.repeat(sequence.paddingLength));

  return {
    code: parts.join(sequence.separator),
  };
};

export const documentSequenceService = {
  list,
  getById,
  getByCode,
  create,
  update,
  remove,
  generateCode,
  previewCode,
};
