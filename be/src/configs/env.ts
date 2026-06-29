import dotenv from 'dotenv';
import path from 'path';
import z from 'zod';
import { envSchema } from '~/schemas/env';

const NODE_ENV = process.env.NODE_ENV;

if (!NODE_ENV) {
  console.error('❌ NODE_ENV is not defined.');
  process.exit(1);
}

dotenv.config({ path: path.resolve(process.cwd(), `.env.${NODE_ENV}`) });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(z.prettifyError(parsedEnv.error));
  process.exit(1);
}

export const env = Object.freeze(parsedEnv.data);
