import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService extends Redis implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(Redis.name);

  public constructor(private readonly configService: ConfigService) {
    super({
      host: configService.getOrThrow<string>('redis.host', { infer: true }),
      port: configService.getOrThrow<number>('redis.port', { infer: true }),
      password: configService.getOrThrow<string>('redis.password', {
        infer: true,
      }),
      maxRetriesPerRequest: 5,
      enableOfflineQueue: true,
    });
  }

  onModuleInit() {
    this.logger.log('🔄 Initializing redis connection...');

    this.on('connect', () => {
      this.logger.log('Redis connecting...');
    });

    this.on('ready', () => {
      this.logger.log('Redis connected');
    });

    this.on('error', (err) => {
      this.logger.error('Redis error', { error: err.message ?? err });
    });

    this.on('close', () => {
      this.logger.warn('Redis connection closed');
    });

    this.on('reconnecting', () => {
      this.logger.warn('Redis reconnecting...');
    });
  }

  async onModuleDestroy() {
    this.logger.log('Closing  Redis connection...');

    try {
      await this.quit();
      this.logger.log('Redis connection closed');
    } catch (err) {
      this.logger.error('Redis error', { error: err });
    }
  }
}
