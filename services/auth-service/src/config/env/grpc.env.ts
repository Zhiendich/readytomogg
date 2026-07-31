import { registerAs } from '@nestjs/config';
import { GrpcConfig } from '../interfaces';
import { validateEnv } from '@readytomog/common';
import { GrpcValidator } from '../validators';

export const grpcEnv = registerAs<GrpcConfig>('grpc', () => {
  validateEnv(process.env, GrpcValidator);

  return {
    host: process.env.GRPC_HOST,
    port: parseInt(process.env.GRPC_PORT),
  };
});
