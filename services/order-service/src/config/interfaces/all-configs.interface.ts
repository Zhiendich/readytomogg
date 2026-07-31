import { GrpcConfig } from './grpc.interface';
import { PrismaConfig } from './prisma.interface';

export interface AllConfigs {
  prisma: PrismaConfig;
  grpc: GrpcConfig;
}
