import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionStatus } from '@prisma/client';
import { SubscriptionRepository } from 'src/infrastructure/prisma/repositories/subscription.repository';

@Injectable()
export class SubscriptionCron {
  private readonly logger = new Logger(SubscriptionCron.name);
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async expireSubscriptions() {
    this.logger.log('Start expiring subscriptions');

    const expiredSubscriptions = await this.subscriptionRepository.getExpiredSubscriptions(
      new Date(),
    );

    if (!expiredSubscriptions.length) {
      this.logger.log('No subscriptions to expire');
      return;
    }

    await this.subscriptionRepository.updateSubscriptionStatus(
      expiredSubscriptions.map((sub) => sub.id),
      SubscriptionStatus.expired,
    );

    this.logger.log(`Expired ${expiredSubscriptions.length} subscriptions`);
  }
}
