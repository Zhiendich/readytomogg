import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { grpcEnv, prismaEnv, providersEnv, redisEnv, rmqEnv } from './config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RepositoryModule } from './infrastructure/prisma/repositories/modules/repository.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { RmqModule } from './infrastructure/rmq/consumer/rmq.module';
import { ProducerModule } from './infrastructure/rmq/producer/producer.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PlanModule } from './modules/plan/plan.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rmqEnv, prismaEnv, grpcEnv, providersEnv, redisEnv],
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
