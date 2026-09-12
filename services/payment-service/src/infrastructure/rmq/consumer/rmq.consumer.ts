import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AllConfigs } from 'src/config';

export const createRmqConsumer = (app: INestApplication, config: ConfigService<AllConfigs>) => {
  const url = config.get('rmq.url', { infer: true });
  const queue = config.get('rmq.queue', { infer: true });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue,
      queueOptions: {
        durable: true,
      },

      prefetchCount: 1,
      noAck: false,
      persistent: true,
    },
  });
};
