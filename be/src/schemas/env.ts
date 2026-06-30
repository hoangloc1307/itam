import z from 'zod';

export const envSchema = z.object({
  // ==================== APP ====================
  PORT: z.coerce
    .number({ error: 'Must be a number.' })
    .int({ error: 'Must be an integer.' })
    .min(1, { error: 'Must be greater than 0.' })
    .max(65535, { error: 'Must be less than 65536.' }),

  // ==================== AUTH ====================
  JWT_SECRET: z.string().min(1, { error: 'JWT_SECRET is required.' }),
  JWT_REFRESH_SECRET: z.string().min(1, { error: 'JWT_REFRESH_SECRET is required.' }),
  JWT_ACCESS_EXPIRY: z.string().min(1, { error: 'JWT_ACCESS_EXPIRY is required.' }),
  JWT_REFRESH_EXPIRY: z.string().min(1, { error: 'JWT_REFRESH_EXPIRY is required.' }),

  // ==================== DATABASE ====================
  DATABASE_URL: z.url({ error: 'Must be a valid URL.' }),
  APP_DATABASE_URL: z.url({ error: 'Must be a valid URL.' }),

  // ==================== SMTP ====================
  SMTP_HOST: z.string().min(1, { error: 'SMTP_HOST is required.' }),
  SMTP_PORT: z.coerce.number({ error: 'SMTP_PORT must be a number.' }),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().min(1, { error: 'SMTP_FROM is required.' }),
});
