import { registerAs } from '@nestjs/config';
import { validateEnv } from '@readytomog/common';

import { RmqValidator } from '../validators';

export const rmqEnv = registerAs('rmq', () => {
  validateEnv(process.env, RmqValidator);

  return {
    url: process.env.RABBITMQ_URL,
    queue: process.env.RABBITMQ_QUEUE,
  };
});
