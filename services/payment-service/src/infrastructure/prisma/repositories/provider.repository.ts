import { Injectable } from '@nestjs/common';
import { BillingPeriod, PaymentProvider, PlanProvider } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ProviderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findProviderByNameAndPlan(provider: PaymentProvider, planId: string) {
    return await this.prismaService.planProvider.findFirst({
      where: {
        provider,
        planId,
      },
    });
  }

  public async findProviderByPlanAndBilling(planId: string, billingPeriod: BillingPeriod) {
    return await this.prismaService.planProvider.findFirst({
      where: {
        planId,
        billingPeriod,
      },
    });
  }

  public async createProviderList(providers: Omit<PlanProvider, 'id'>[]) {
    for (const provider of providers) {
      await this.prismaService.planProvider.create({
        data: provider,
      });
    }
  }
}
