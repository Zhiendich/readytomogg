import { registerAs } from '@nestjs/config';

import { validateEnv } from '@readytomog/common';
import { TotpEncryptionValidator } from '../validators';
import { TotpEncryptionConfig } from '../interfaces';

export const encryptionEnv = registerAs<TotpEncryptionConfig>(
  'encryption',
  () => {
    validateEnv(process.env, TotpEncryptionValidator);

    return {
      encryption_secret: process.env.TOTP_ENCRYPTION_SECRET,
    };
  },
);
