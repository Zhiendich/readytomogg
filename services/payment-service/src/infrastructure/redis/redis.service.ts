import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import Redis from 'ioredis';
import { AllConfigs } from 'src/config';

@Injectable()
export class CacheService extends Redis implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(CacheService.name);
  constructor(private readonly configService: ConfigService<AllConfigs>) {
    super({
      port: configService.get('redis.port', { infer: true }),
      host: configService.get('redis.host', { infer: true }),
      password: configService.get('redis.password', { infer: true }),
      maxRetriesPerRequest: 5,
      enableOfflineQueue: true,
    });
  }

  onModuleInit() {
    this.logger.log('Redis init');
    this.on('connect', () => {
      this.logger.log('Redis connecting');
    });

    this.on('ready', () => {
      this.logger.log('Redis connected');
    });

    this.on('error', (err) => {
      this.logger.warn('Error', err.message);
    });

    this.on('reconnecting', () => {
      this.logger.log('Reconnecting...');
    });

    this.on('close', () => {
      this.logger.warn('Redis closed');
    });
  }

  public async distributedLockOperation(key: string, callback: () => Promise<any>) {
    const token = crypto.randomUUID();

    try {
      const lock = await this.set(key, token, 'EX', 10, 'NX');

      if (lock === null) {
        return;
      }
      await callback();
    } finally {
      await this.releaseLock(key, token);
    }
  }

  public async releaseLock(key: string, token: string) {
    const script = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
      return redis.call("DEL", KEYS[1])
    else
      return 0
    end
  `;

    return this.eval(script, 1, key, token);
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
