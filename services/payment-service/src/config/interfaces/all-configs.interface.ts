import { GrpcConfig } from './grpc.interface';
import { PrismaConfig } from './prisma.interface';
import { ProvidersConfig } from './providers.interface';
import { RedisConfig } from './redis.interface';
import { RmqConfig } from './rmq.interface';

export interface AllConfigs {
  prisma: PrismaConfig;
  grpc: GrpcConfig;
  rmq: RmqConfig;
  providers: ProvidersConfig;
  redis: RedisConfig;
}
