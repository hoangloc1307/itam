import z from 'zod';

export const envSchema = z.object({
  // ==================== APP ====================
  PORT: z.coerce
    .number({ error: 'Must be a number.' })
    .int({ error: 'Must be an integer.' })
    .min(1, { error: 'Must be greater than 0.' })
    .max(65535, { error: 'Must be less than 65536.' }),

  // ==================== DATABASE ====================
  DATABASE_URL: z.url({ error: 'Must be a valid URL.' }),
  APP_DATABASE_URL: z.url({ error: 'Must be a valid URL.' }),
});
