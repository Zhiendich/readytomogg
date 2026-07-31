import { registerAs } from '@nestjs/config';
import { MongoConfig } from '../interfaces';
import { validateEnv } from '@readytomog/common';
import { MongoValidator } from '../validators';

export const mongoEnv = registerAs<MongoConfig>('mongo', () => {
  validateEnv(process.env, MongoValidator);

  return {
    mongo_url: process.env.MONGODB_URI,
  };
});
