import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AllConfigs } from './config/interfaces/all-configs.interface';
import { createGrpcServer } from './infrastructure/grpc/grpc.server';
import { createRmqConsumer } from './infrastructure/rmq/consumer/rmq.consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<AllConfigs>);
  createGrpcServer(app, config);
  createRmqConsumer(app, config);

  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
