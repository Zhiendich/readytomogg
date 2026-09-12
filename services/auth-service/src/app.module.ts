import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppContoller } from './app.contoller';
import { grpcEnv, jwtEnv, mongoEnv, redisEnv } from './config';
import { rmqEnv } from './config/env/rmq.env';
import { encryptionEnv } from './config/env/totp-ecryption.env';
import { MongoModule } from './infrastructure/mongo/mongo.module';
import { RepositoryModule } from './infrastructure/mongo/repositories/modules/repository.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { ProducerModule } from './infrastructure/rmq/producer/producer.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { OtpModule } from './modules/otp/otp.module';
import { TwoFactorModule } from './modules/two-factor/two-factor.module';
import { ObservabilityModule } from './observability/observability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env.dev',
      load: [grpcEnv, redisEnv, jwtEnv, encryptionEnv, rmqEnv, mongoEnv],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL,
        transport: {
          target: 'pino/file',
          options: {
            destination: './logs/auth/auth.log',
            mkdir: true,
          },
        },
        messageKey: 'msg',
        customProps: () => ({ service: 'auth-service' }),
      },
    }),
    MongoModule,
    RepositoryModule,
    RedisModule,
    ProducerModule,
    ObservabilityModule,
    JwtModule,
    AuthModule,
    OtpModule,
    TwoFactorModule,
  ],

  controllers: [AppContoller],
})
export class AppModule {}
