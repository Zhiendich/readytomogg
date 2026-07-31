import { registerAs } from '@nestjs/config';
import { validateEnv } from '@readytomog/common';

import { SmsConfig } from '../interfaces';
import { SmsValidator } from '../validators';

export const smsEnv = registerAs<SmsConfig>('sms', () => {
  validateEnv(process.env, SmsValidator);

  return {
    provider_token: process.env.SMSCLUB_TOKEN,
    sender: process.env.SMSCLUB_SENDER,
  };
});
