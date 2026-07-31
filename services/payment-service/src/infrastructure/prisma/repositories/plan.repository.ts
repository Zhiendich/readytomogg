import { Injectable } from '@nestjs/common';
import { Plans, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class PlanRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async getPlansList() {
    return await this.prismaService.plans.findMany({});
  }

  public async getPlanById(planId: string) {
    return await this.prismaService.plans.findFirst({
      where: {
        id: planId,
      },
    });
  }

  public async createPlanList(plans: Prisma.PlansUncheckedCreateInput[]) {
    for (const plan of plans) {
      const exist = await this.prismaService.plans.findFirst({
        where: {
          title: plan.title,
        },
      });

      if (!exist) {
        await this.prismaService.plans.create({
          data: plan,
        });
      }
    }
  }
}
