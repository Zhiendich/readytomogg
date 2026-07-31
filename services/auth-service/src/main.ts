import { AllConfigs } from './config/interfaces/all-configs.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

import helmet from 'helmet';
import compression from 'compression';

import { ConfigService } from '@nestjs/config';
import { createGrpcServer } from './infrastructure/grpc/grpc.server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService<AllConfigs>);

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(compression());
  app.enableCors({ origin: [process.env.FRONTEND_URL], credentials: true });
  app.use(cookieParser());

  createGrpcServer(app, config);

  await app.startAllMicroservices();
  await app.init();
}
bootstrap();
