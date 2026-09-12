import { GrpcConfig } from './grpc.interface';
import { PrismaConfig } from './prisma.interface';
import { RmqConfig } from './rmq.interface';

export interface AllConfigs {
  prisma: PrismaConfig;
  grpc: GrpcConfig;
  rmq: RmqConfig;
}
