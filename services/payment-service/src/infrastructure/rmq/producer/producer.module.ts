import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AllConfigs } from 'src/config';

import { ProducerService } from './producer.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'GATEWAY_CLIENT',
        useFactory: (configService: ConfigService<AllConfigs>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rmq.url', { infer: true })],
            queue: configService.get<string>('rmq.client_queue', { infer: true }),
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
