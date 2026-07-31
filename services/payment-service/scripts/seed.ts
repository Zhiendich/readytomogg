import { NestFactory } from '@nestjs/core';
import { SeedModule } from 'src/infrastructure/prisma/seed/seed.module';
import { SeedService } from 'src/infrastructure/prisma/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  const seedService = app.get(SeedService);
  await seedService.addPlansList();
  await seedService.addPlanProviders();

  await app.close();
}

bootstrap();
