import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';

import { ConfigModule } from '@nestjs/config';

import { grpcEnv, jwtEnv, mongoEnv, redisEnv } from './config';

import { RedisModule } from './infrastructure/redis/redis.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { OtpModule } from './modules/otp/otp.module';
import { TwoFactorModule } from './modules/two-factor/two-factor.module';
import { encryptionEnv } from './config/env/totp-ecryption.env';
import { rmqEnv } from './config/env/rmq.env';
import { ProducerModule } from './infrastructure/rmq/producer/producer.module';
import { MongoModule } from './infrastructure/mongo/mongo.module';
import { RepositoryModule } from './infrastructure/mongo/repositories/modules/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [grpcEnv, redisEnv, jwtEnv, encryptionEnv, rmqEnv, mongoEnv],
    }),
    MongoModule,
    RepositoryModule,
    RedisModule,
    ProducerModule,
    JwtModule,
    AuthModule,
    OtpModule,
    TwoFactorModule,
  ],
})
export class AppModule {}
