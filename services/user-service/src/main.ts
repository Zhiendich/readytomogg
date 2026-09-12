import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { createGrpcServer } from './infrastructure/grpc/grpc.server';
import { createRmqConsumer } from './infrastructure/rmq/consumer/rmq.consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  createRmqConsumer(app, config);
  createGrpcServer(app, config);

  await app.startAllMicroservices();
  await app.listen(9102);
}
bootstrap();
