import { GrpcConfig } from './grpc.interface';
import { HttpConfig } from './http.interface';
import { ProvidersConfig } from './providers.interface';
import { RedisConfig } from './redis.interface';
import { RmqConfig } from './rmq.interface';

export interface AllConfigs {
  redis: RedisConfig;
  grpc: GrpcConfig;
  rmq: RmqConfig;
  providers: ProvidersConfig;
  http: HttpConfig;
}
