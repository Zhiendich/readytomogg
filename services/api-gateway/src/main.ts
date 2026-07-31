import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { createRmqConsumer } from './infrastructure/rmq/consumer/rmq.consumer';
import { GrpcExceptionFilter } from './shared/filters/grpc-exception.filter';

const setUpSwagger = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle('ReadyToMog Api')
    .setDescription('Api gateway for ReadyToMog')
    .setVersion('1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const config = app.get(ConfigService);
  const logger = new Logger();

  createRmqConsumer(app, config);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new GrpcExceptionFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: config.getOrThrow<string>('HTTP_CORS').split(','),
    credential: true,
  });

  setUpSwagger(app);

  const port = config.getOrThrow<number>('HTTP_PORT');
  const host = config.getOrThrow<number>('HTTP_HOST');

  await app.init();
  await app.startAllMicroservices();

  await app.listen(port);

  logger.log(`Gateway started: ${host}`);
  logger.log(`Swagger : ${host}/docs`);
}
bootstrap();
