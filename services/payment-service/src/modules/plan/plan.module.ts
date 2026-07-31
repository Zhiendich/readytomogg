import { Module } from '@nestjs/common';

import { GetPlansListMapper } from './mappers/plan.mapper';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  controllers: [PlanController],
  providers: [PlanService, GetPlansListMapper],
})
export class PlanModule {}
