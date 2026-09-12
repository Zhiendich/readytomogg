import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { AllConfigs } from 'src/config/interfaces';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  constructor(private readonly configService: ConfigService<AllConfigs>) {
    super({
      adapter: new PrismaPg({
        user: configService.get('prisma.user', { infer: true }),
        password: configService.get('prisma.password', { infer: true }),
        port: configService.get('prisma.port', { infer: true }),
        database: configService.get('prisma.databaseName', { infer: true }),
        host: configService.get('prisma.host', { infer: true }),
      }),
    });
  }

  public async onModuleInit() {
    this.logger.log('🔄 Initializing database connection...');

    try {
      await this.$connect();
      this.logger.log('✅ Database connection established successfully.');
    } catch (error) {
      this.logger.error('❌ Failed to establish database connection.', error);
      throw error;
    }
  }

  public async onModuleDestroy() {
    this.logger.log('🔻 Closing database connection...');

    try {
      await this.$disconnect();
      this.logger.log('🟢 Database connection closed successfully.');
    } catch (error) {
      this.logger.error('⚠️ Error occurred while closing the database connection.', error);
      throw error;
    }
  }
}
