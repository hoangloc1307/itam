import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Prisma CLI (migrate, studio) dùng DATABASE_URL → tài khoản có quyền DDL
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
