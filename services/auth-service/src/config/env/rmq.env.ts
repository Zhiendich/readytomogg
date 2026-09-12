import { registerAs } from '@nestjs/config';
import { RmqConfig } from '../interfaces';
import { validateEnv } from '@readytomog/common';
import { RmqValidator } from '../validators';

export const rmqEnv = registerAs<RmqConfig>('rmq', () => {
  validateEnv(process.env, RmqValidator);

  return {
    url: process.env.RABBITMQ_URL,
  };
});
