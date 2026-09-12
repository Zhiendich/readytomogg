import { registerAs } from '@nestjs/config';
import { validateEnv } from '@readytomog/common';

import { PrismaConfig } from '../interfaces';
import { PrismaValidator } from '../validators';

export const prismaEnv = registerAs<PrismaConfig>('prisma', () => {
  validateEnv(process.env, PrismaValidator);

  return {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    databaseName: process.env.DATABASE_NAME,
  };
});
