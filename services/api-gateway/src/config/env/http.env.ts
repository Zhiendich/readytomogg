import { registerAs } from '@nestjs/config';
import { validateEnv } from '@readytomog/common';

import { HttpConfig } from '../interfaces';
import { HttpValidator } from '../validators';

export const httpEnv = registerAs<HttpConfig>('http', () => {
  validateEnv(process.env, HttpValidator);

  return {
    auth_http_url: process.env.AUTH_HTTP_URL,
    chat_http_url: process.env.CHAT_HTTP_URL,
    user_http_url: process.env.USER_HTTP_URL,
    payment_http_url: process.env.PAYMENT_HTTP_URL,
  };
});
