import { registerAs } from '@nestjs/config';
import { validateEnv } from '@readytomog/common';

import { RmqConfig } from '../interfaces';
import { RmqValidator } from '../validators/rmq.validator';

export const rmqEnv = registerAs<RmqConfig>('rmq', () => {
  validateEnv(process.env, RmqValidator);

  return {
    url: process.env.RABBITMQ_URL,
    queue: process.env.RABBITMQ_QUEUE,
  };
});
