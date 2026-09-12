import { GrpcOptions } from '@nestjs/microservices';
import { PROTO_PATHS } from '@readytomog/contracts';

export const grpcPackages = ['chat.v1'];

export const grpcProtoPaths = [PROTO_PATHS.CHAT];

export const grpcLoader: NonNullable<GrpcOptions['options']['loader']> = {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
