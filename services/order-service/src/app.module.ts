import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { grpcEnv, prismaEnv } from './config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RepositoryModule } from './infrastructure/prisma/repositories/modules/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [grpcEnv, prismaEnv],
    }),
    PrismaModule,
    RepositoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
