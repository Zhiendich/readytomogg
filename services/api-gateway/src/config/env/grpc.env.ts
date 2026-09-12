import { registerAs } from '@nestjs/config';
import { validateEnv } from '@readytomog/common';

import { GrpcConfig } from '../interfaces';
import { GrpcValidator } from '../validators';

export const grpcEnv = registerAs<GrpcConfig>('grpc', () => {
  validateEnv(process.env, GrpcValidator);

  return {
    auth_grpc_url: process.env.AUTH_GRPC_URL,
    user_grpc_url: process.env.USER_GRPC_URL,
    chat_grpc_url: process.env.CHAT_GRPC_URL,
    payment_grpc_url: process.env.PAYMENT_GRPC_URL,
  };
});
