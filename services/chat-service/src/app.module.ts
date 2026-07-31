import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { grpcEnv, prismaEnv } from './config/env';
import { rmqEnv } from './config/env/rmq.env';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RepositoryModule } from './infrastructure/prisma/repositories/modules/repository.module';
import { RmqModule } from './infrastructure/rmq/consumer/rmq.module';
import { ProducerModule } from './infrastructure/rmq/producer/producer.module';
import { ChatModule } from './modules/chat/chat.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [prismaEnv, grpcEnv, rmqEnv],
    }),
    PrismaModule,
    ProducerModule,
    RepositoryModule,
    ChatModule,
    RmqModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
