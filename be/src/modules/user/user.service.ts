import type { CreateUserInput, UpdateUserInput } from 'itam-shared/schemas/user';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import { prisma } from '~/lib/prisma';
import { mailService } from '~/services/mail.service';
import { generateRandomPassword, hashPassword } from '~/utils';

interface ListParams {
  page: number;
  limit: number;
  search?: string;
}

const list = async ({ page, limit, search }: ListParams) => {
  const where = {
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

  const [data, totalItems] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        username: true,
        name: true,
        email: true,
        isActive: true,
        createdBy: true,
        createdAt: true,
        updatedBy: true,
        updatedAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, totalItems };
};

const getById = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      name: true,
      email: true,
      isActive: true,
      createdBy: true,
      createdAt: true,
      updatedBy: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw AppError.notFound(t('user:notFound'));
  }

  return user;
};

const create = async (input: CreateUserInput, createdBy: string) => {
  const existing = await prisma.user.findUnique({ where: { username: input.username } });

  if (existing) {
    throw AppError.conflict(t('user:usernameExists'));
  }

  const emailExists = await prisma.user.findUnique({ where: { email: input.email } });

  if (emailExists) {
    throw AppError.conflict(t('user:emailExists'));
  }

  const plainPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(plainPassword);

  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      name: input.name,
      password: hashedPassword,
      isActive: input.isActive,
      createdBy,
    },
    select: {
      username: true,
      name: true,
      email: true,
      isActive: true,
      createdBy: true,
      createdAt: true,
      updatedBy: true,
      updatedAt: true,
    },
  });

  await mailService.sendEmail({
    to: input.email,
    subject: 'ITAM - Tài khoản của bạn đã được tạo',
    template: 'account-created',
    data: { name: input.name, username: input.username, password: plainPassword },
  });

  return user;
};

const update = async (username: string, input: UpdateUserInput, updatedBy: string) => {
  const existing = await prisma.user.findUnique({ where: { username } });

  if (!existing) {
    throw AppError.notFound(t('user:notFound'));
  }

  if (input.email && input.email !== existing.email) {
    const emailExists = await prisma.user.findFirst({
      where: { email: input.email, username: { not: username } },
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
    select: {
      username: true,
      name: true,
      email: true,
      isActive: true,
      createdBy: true,
      createdAt: true,
      updatedBy: true,
      updatedAt: true,
    },
  });
};

const resetPassword = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username } });

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

export const userService = { list, getById, create, update, resetPassword };
