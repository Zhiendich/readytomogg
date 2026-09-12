import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { createRmqConsumer } from './infrastructure/rmq/consumer/rmq.consumer';
import './observability/tracing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  createRmqConsumer(app, config);

  await app.startAllMicroservices();
  await app.listen(9105);
}
bootstrap();
