import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';

import { AppContoller } from './app.contoller';
import { grpcEnv, prismaEnv, providersEnv, redisEnv, rmqEnv } from './config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RepositoryModule } from './infrastructure/prisma/repositories/modules/repository.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { RmqModule } from './infrastructure/rmq/consumer/rmq.module';
import { ProducerModule } from './infrastructure/rmq/producer/producer.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PlanModule } from './modules/plan/plan.module';
import { UserModule } from './modules/user/user.module';
import { ObservabilityModule } from './observability/observability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rmqEnv, prismaEnv, grpcEnv, providersEnv, redisEnv],
    }),
    ObservabilityModule,
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
        customProps: () => ({ service: 'payment-service' }),
      },
    }),
    PrismaModule,
    RedisModule,
    HttpModule.register({
      global: true,
    }),
    RmqModule,
    ScheduleModule.forRoot(),
    ProducerModule,
    RepositoryModule,
    PaymentModule,
    PlanModule,
    UserModule,
  ],
  controllers: [AppContoller],
})
export class AppModule {}
