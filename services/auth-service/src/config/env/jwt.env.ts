import { registerAs } from '@nestjs/config';

import { validateEnv } from '@readytomog/common';
import { JwtValidator } from '../validators';
import { JwtConfig } from '../interfaces';

export const jwtEnv = registerAs<JwtConfig>('jwt', () => {
  validateEnv(process.env, JwtValidator);

  return {
    access_token: process.env.JWT_ACCESS_SECRET,
    refresh_token: process.env.JWT_REFRESH_SECRET,
  };
});
