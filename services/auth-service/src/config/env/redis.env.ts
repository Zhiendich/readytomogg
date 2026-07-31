import { registerAs } from '@nestjs/config';

import { validateEnv } from '@readytomog/common';
import { RedisValidator } from '../validators';
import { RedisConfig } from '../interfaces';

export const redisEnv = registerAs<RedisConfig>('redis', () => {
  validateEnv(process.env, RedisValidator);

  return {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  };
});
