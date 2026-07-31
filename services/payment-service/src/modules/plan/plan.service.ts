import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@readytomog/common';
import { PlanRepository } from 'src/infrastructure/prisma/repositories/plan.repository';

import { GetPlansListMapper } from './mappers/plan.mapper';

@Injectable()
export class PlanService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly getPlansListMapper: GetPlansListMapper,
  ) {}
  public async getPlansList() {
    const plans = await this.planRepository.getPlansList();
    return this.getPlansListMapper.toDomain({ plans });
  }

  public async getPlanById(planId: string) {
    const plan = await this.planRepository.getPlanById(planId);

    if (!plan) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Plan was not founded',
      });
    }

    return this.getPlansListMapper.toDomain({ plans: [plan] })[0];
  }
}
