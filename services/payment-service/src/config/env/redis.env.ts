import { registerAs } from '@nestjs/config';
import { validateEnv } from '@readytomog/common';

import { RedisConfig } from '../interfaces';
import { RedisValidator } from '../validators';

export const redisEnv = registerAs<RedisConfig>('redis', () => {
  validateEnv(process.env, RedisValidator);

  return {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  };
});
