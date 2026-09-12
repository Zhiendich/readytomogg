import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppContoller } from './app.contoller';
import { grpcEnv, prismaEnv, rmqEnv } from './config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RepositoryModule } from './infrastructure/prisma/repositories/modules/repository.module';
import { RmqModule } from './infrastructure/rmq/consumer/rmq.module';
import { UserModule } from './modules/user/user.module';
import { ObservabilityModule } from './observability/observability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env.dev',
      load: [rmqEnv, prismaEnv, grpcEnv],
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
        customProps: () => ({ service: 'user-service' }),
      },
    }),
    PrismaModule,
    RepositoryModule,
    RmqModule,
    UserModule,
  ],

  controllers: [AppContoller],
})
export class AppModule {}
