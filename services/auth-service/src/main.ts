import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllConfigs } from './config/interfaces/all-configs.interface';
import { createGrpcServer } from './infrastructure/grpc/grpc.server';
import './observability/tracing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService<AllConfigs>);

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  createGrpcServer(app, config);

  await app.startAllMicroservices();
  await app.listen(9101);
}
bootstrap();
