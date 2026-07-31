import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ProducerService } from './producer.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'CHAT_CLIENT',
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: configService.get('RABBITMQ_URL'),
              queueOptions: {
                durable: true,
              },
              queue: 'chat_queue',
            },
          }),
          inject: [ConfigService],
        },

        {
          name: 'PAYMENT_CLIENT',
          useFactory: (configService) => ({
            transport: Transport.RMQ,
            options: {
              urls: configService.get('RABBITMQ_URL'),
              queueOptions: {
                durable: true,
              },
              queue: 'payment_queue',
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}
