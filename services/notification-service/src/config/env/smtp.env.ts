import { registerAs } from '@nestjs/config';
import { validateEnv } from '@readytomog/common';

import { SMTPConfig } from '../interfaces';
import { SMTPValidator } from '../validators';

export const smtpEnv = registerAs<SMTPConfig>('smtp', () => {
  validateEnv(process.env, SMTPValidator);

  return {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    secure: process.env.SMTP_SECURE,
    fromAddress: process.env.SMTP_FROM_ADDRESS,
  };
});
