import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import 'reflect-metadata';
import { prismaEnv } from 'src/config';

import { PrismaModule } from '../prisma.module';
import { RepositoryModule } from '../repositories/modules/repository.module';

import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [prismaEnv],
    }),
    PrismaModule,
    RepositoryModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
