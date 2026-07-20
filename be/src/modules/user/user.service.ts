import type { CreateUserInput, UpdateUserInput } from 'itam-shared/schemas/user';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import { prisma } from '~/lib/prisma';
import { mailService } from '~/services/mail.service';
import { generateRandomPassword, hashPassword } from '~/utils';

interface ListParams {
  search?: string;
}

const userSelect = {
  username: true,
  name: true,
  email: true,
  isActive: true,
  deletedAt: true,
  createdBy: true,
  createdAt: true,
  updatedBy: true,
  updatedAt: true,
} as const;

const list = async ({ search }: ListParams) => {
  const where = {
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { username: { contains: search } },
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const data = await prisma.user.findMany({
    where,
    select: userSelect,
    orderBy: { createdAt: 'desc' },
  });

  return data;
};

const getById = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username, deletedAt: null },
    select: userSelect,
  });

  if (!user) {
    throw AppError.notFound(t('user:notFound'));
  }

  return user;
};

const create = async (input: CreateUserInput, createdBy: string) => {
  const existing = await prisma.user.findUnique({ where: { username: input.username } });

  if (existing && !existing.deletedAt) {
    throw AppError.conflict(t('user:usernameExists'));
  }

  const emailExists = await prisma.user.findFirst({
    where: { email: input.email, deletedAt: null },
  });

  if (emailExists) {
    throw AppError.conflict(t('user:emailExists'));
  }

  const plainPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(plainPassword);

  let user;

  if (existing && existing.deletedAt) {
    user = await prisma.user.update({
      where: { username: input.username },
      data: {
        email: input.email,
        name: input.name,
        password: hashedPassword,
        isActive: input.isActive,
        deletedAt: null,
        createdBy,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: null,
      },
      select: userSelect,
    });
  } else {
    user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        name: input.name,
        password: hashedPassword,
        isActive: input.isActive,
        createdBy,
      },
      select: userSelect,
    });
  }

  await mailService.sendEmail({
    to: input.email,
    subject: 'ITAM - Tài khoản của bạn đã được tạo',
    template: 'account-created',
    data: { name: input.name, username: input.username, password: plainPassword },
  });

  return user;
};

const update = async (username: string, input: UpdateUserInput, updatedBy: string) => {
  const existing = await prisma.user.findUnique({ where: { username, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('user:notFound'));
  }

  if (input.email && input.email !== existing.email) {
    const emailExists = await prisma.user.findFirst({
      where: { email: input.email, username: { not: username }, deletedAt: null },
    });

    if (emailExists) {
      throw AppError.conflict(t('user:emailExists'));
    }
  }

  return prisma.user.update({
    where: { username },
    data: {
      ...input,
      updatedBy,
      updatedAt: new Date(),
    },
    select: userSelect,
  });
};

const remove = async (username: string) => {
  const existing = await prisma.user.findUnique({ where: { username, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('user:notFound'));
  }

  return prisma.user.update({
    where: { username },
    data: { deletedAt: new Date() },
  });
};

const resetPassword = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username, deletedAt: null } });

  if (!user) {
    throw AppError.notFound(t('user:notFound'));
  }

  const plainPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(plainPassword);

  await prisma.user.update({
    where: { username },
    data: { password: hashedPassword },
  });

  if (user.email) {
    await mailService.sendEmail({
      to: user.email,
      subject: 'ITAM - Mật khẩu đã được đặt lại',
      template: 'password-reset',
      data: { name: user.name ?? username, username, password: plainPassword },
    });
  }

  return { username };
};

export const userService = { list, getById, create, update, remove, resetPassword };
