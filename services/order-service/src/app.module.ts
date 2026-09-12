import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppContoller } from './app.contoller';
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
  controllers: [AppContoller],
})
export class AppModule {}
