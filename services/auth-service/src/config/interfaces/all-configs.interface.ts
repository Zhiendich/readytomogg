import { GrpcConfig } from './grpc.interface';
import { MongoConfig } from './mongo.interface';
import { RedisConfig } from './redis.interface';
import { RmqConfig } from './rmq.interface';
import { TotpEncryptionConfig } from './totp-ecryption.interface';

export interface AllConfigs {
  grpc: GrpcConfig;
  redis: RedisConfig;
  encryption: TotpEncryptionConfig;
  rmq: RmqConfig;
  mongo: MongoConfig;
}
