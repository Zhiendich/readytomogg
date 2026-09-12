import { Injectable } from '@nestjs/common';
import { SubscriptionStatus, UserSubscription } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async getSubscriptionByUserId(userId: string) {
    return await this.prismaService.userSubscription.findFirst({
      where: {
        userId,
      },
    });
  }

  public async getSubscriptionByIdAndUserId(userId: string, id: string) {
    return await this.prismaService.userSubscription.findFirst({
      where: {
        userId,
        id,
      },
    });
  }

  public async createSubscription(
    subscription: Omit<UserSubscription, 'id' | 'createdAt' | 'updatedAt' | 'transactionId'>,
  ) {
    const { userId, planId, ...rest } = subscription;
    return await this.prismaService.userSubscription.create({
      data: {
        ...rest,
        user: { connect: { id: userId } },
        plan: { connect: { id: planId } },
      },
    });
  }

  public async updateSubscription(id: string, data: Partial<UserSubscription>) {
    return await this.prismaService.userSubscription.update({
      where: { id },
      data,
    });
  }

  public async updateStripeSubscriptionId(
    userId: string,
    stripeSubscriptionId: string,
    transactionId?: string,
  ) {
    return await this.prismaService.userSubscription.update({
      where: {
        userId,
      },
      data: {
        transactionId,
        stripeSubscriptionId,
      },
    });
  }

  public async getExpiredSubscriptions(time: Date) {
    return await this.prismaService.userSubscription.findMany({
      where: {
        status: SubscriptionStatus.active,
        currentPeriodEnd: {
          lte: time,
        },
        user: {
          isAutoRenewal: false,
        },
      },

      include: {
        transaction: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        plan: true,
        user: true,
      },
    });
  }

  public async updateSubscriptionStatus(ids: string[], status: SubscriptionStatus) {
    return await this.prismaService.userSubscription.updateMany({
      where: {
        id: {
          in: ids,
        },
        status: SubscriptionStatus.active,
      },
      data: {
        status,
      },
    });
  }
}
