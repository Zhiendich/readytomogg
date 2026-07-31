import { registerAs } from '@nestjs/config';
import { validateEnv } from '@readytomog/common';

import { ProvidersConfig } from '../interfaces';
import { ProvidersValidator } from '../validators';

export const providersEnv = registerAs<ProvidersConfig>('providers', () => {
  validateEnv(process.env, ProvidersValidator);

  return {
    liqpay_public_key: process.env.LIGPAY_PUBLIC_KEY,
    liqpay_private_key: process.env.LIQPAY_PRIVATE_KEY,
    liqpay_server_url: process.env.LIQPAY_SERVER_URL,
    stripe_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  };
});
