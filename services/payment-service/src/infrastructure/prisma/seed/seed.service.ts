import { Injectable, Logger } from '@nestjs/common';
import { BillingPeriod, PaymentProvider, Prisma } from '@prisma/client';
import { PlanRepository } from 'src/infrastructure/prisma/repositories/plan.repository';

import { ProviderRepository } from '../repositories/provider.repository';

@Injectable()
export class SeedService {
  private logger = new Logger(SeedService.name);
  private readonly plans: Prisma.PlansUncheckedCreateInput[] = [
    {
      title: 'Basic',
      monthlyPrice: new Prisma.Decimal(5),
      annualyPrice: new Prisma.Decimal(50),
      description: 'Basic features for personal usage',
    },
    {
      title: 'Pro',
      monthlyPrice: new Prisma.Decimal(10),
      annualyPrice: new Prisma.Decimal(100),
      description: 'Advanced features for professionals',
    },
    {
      title: 'Enterprise',
      monthlyPrice: new Prisma.Decimal(20),
      annualyPrice: new Prisma.Decimal(200),
      description: 'Full access for teams and businesses',
    },
  ];

  private readonly stripeProviders = {
    Basic: {
      monthly: 'price_1TXlFk09YXE9QiJoyViibNwn',
      annualy: 'price_1TXlKG09YXE9QiJoyCNvXerP',
    },
    Pro: {
      monthly: 'price_1TXlGT09YXE9QiJoMuaMLjDv',
      annualy: 'price_1TXlJn09YXE9QiJoDptleRK8',
    },
    Enterprise: {
      monthly: 'price_1TXlHP09YXE9QiJodslXNQPl',
      annualy: 'price_1TXlJF09YXE9QiJo0IDPn8i6',
    },
  };

  constructor(
    private readonly planRepository: PlanRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  public async addPlansList() {
    this.logger.log('Start seeding plans');
    await this.planRepository.createPlanList(this.plans);
    this.logger.log('Finished seeding plans');
  }

  public async addPlanProviders() {
    this.logger.log('Start seeding plans provider');
    const plans = await this.planRepository.getPlansList();

    for (const plan of plans) {
      const providerData = this.stripeProviders[plan.title];
      if (!providerData) continue;

      const existStripe = await this.providerRepository.findProviderByNameAndPlan(
        PaymentProvider.stripe,
        plan.id,
      );

      const existLiqpay = await this.providerRepository.findProviderByNameAndPlan(
        PaymentProvider.liqpay,
        plan.id,
      );

      if (!existStripe) {
        await this.providerRepository.createProviderList([
          {
            planId: plan.id,
            externalPriceId: providerData.monthly,
            billingPeriod: BillingPeriod.monthly,
            provider: PaymentProvider.stripe,
          },
          {
            planId: plan.id,
            externalPriceId: providerData.annualy,
            billingPeriod: BillingPeriod.annualy,
            provider: PaymentProvider.stripe,
          },
        ]);
      }

      if (!existLiqpay) {
        await this.providerRepository.createProviderList([
          {
            planId: plan.id,
            externalPriceId: null,
            billingPeriod: BillingPeriod.monthly,
            provider: PaymentProvider.liqpay,
          },
          {
            planId: plan.id,
            externalPriceId: null,
            billingPeriod: BillingPeriod.annualy,
            provider: PaymentProvider.liqpay,
          },
        ]);
      }
    }

    this.logger.log('Finished seeding plans provider');
  }
}
