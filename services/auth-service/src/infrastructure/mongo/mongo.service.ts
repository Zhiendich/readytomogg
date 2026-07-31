import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoService.name);
  constructor(@InjectConnection() private connection: Connection) {}

  onModuleInit() {
    this.connection.on('connected', () => {
      this.logger.log('MongoDB connected successfully');
    });

    this.connection.on('error', (error) => {
      this.logger.error('MongoDB error', error);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('MongoDB disconnected');
    });

    this.connection.on('reconnecting', () => {
      this.logger.warn('Mongo reconnecting...');
    });
  }

  async onModuleDestroy() {
    await this.connection.close();
    this.logger.log('MongoDB connection close');
  }
}
