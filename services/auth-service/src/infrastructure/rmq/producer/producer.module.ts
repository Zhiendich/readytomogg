import { Global, Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_CLIENT',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: configService.getOrThrow('RABBITMQ_URL'),
            queue: 'notification_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'USER_CLIENT',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: configService.getOrThrow('RABBITMQ_URL'),
            queue: 'user_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'CHAT_CLIENT',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: configService.getOrThrow('RABBITMQ_URL'),
            queue: 'chat_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'PAYMENT_CLIENT',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: configService.get('RABBITMQ_URL'),
            queue: 'payment_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}
