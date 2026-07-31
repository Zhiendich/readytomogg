import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  BillingPeriod,
  PaymentProvider,
  SubscriptionStatus,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { RpcStatus } from '@readytomog/common';
import {
  CreateLiqpayPaymentSubscriptionEvent,
  type CreateStripePaymentSubscriptionEvent,
  type FailedStripePaymentSubscriptionEvent,
  type RenewedStripeSubscriptionEvent,
} from '@readytomog/contracts';
import * as crypto from 'crypto';
import { PlanRepository } from 'src/infrastructure/prisma/repositories/plan.repository';
import { ProviderRepository } from 'src/infrastructure/prisma/repositories/provider.repository';
import { SubscriptionRepository } from 'src/infrastructure/prisma/repositories/subscription.repository';
import { TransactionRepository } from 'src/infrastructure/prisma/repositories/transaction.repository';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { CacheService } from 'src/infrastructure/redis/redis.service';

import { InitSubscriptionTransactionType, TransactionWithSubscription } from '../payment.type';
import { LiqpayProvider } from '../providers/liqpay.provider';
import { StripeProvider } from '../providers/stripe.provider';

// TODO refactor this
@Injectable()
export class SubscriptionService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
    private readonly cacheService: CacheService,
    private readonly stripeProvider: StripeProvider,
    private readonly liqpayProvider: LiqpayProvider,
  ) {}

  private async calculateSubscriptionEndDate(
    status: TransactionStatus,
    transaction: TransactionWithSubscription,
    billingPeriod: BillingPeriod,
    planId: string,
  ) {
    const subscription = transaction.subscription;

    if (status === TransactionStatus.success && subscription) {
      const now = new Date();
      const isPlanChange = transaction.plan.id !== planId;

      let baseDate: Date;

      if (!subscription.currentPeriodEnd || subscription.currentPeriodEnd < now || isPlanChange) {
        baseDate = new Date(now);
      } else {
        baseDate = new Date(subscription.currentPeriodEnd);
      }
      const newEndDate = new Date(baseDate);

      if (billingPeriod === BillingPeriod.annualy) {
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      } else {
        const currentDay = newEndDate.getDate();
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        if (newEndDate.getDate() !== currentDay) newEndDate.setDate(0);
      }
      await this.subscriptionRepository.updateSubscription(subscription.id, {
        status: SubscriptionStatus.active,
        currentPeriodStart: now,
        currentPeriodEnd: newEndDate,
        billingPeriod,
        updatedAt: now,
        planId,
      });
    }
  }

  private async processSubscriptionPayment(
    transactionId: string,
    status: TransactionStatus,
    planId: string,
    billingPeriod: BillingPeriod,
    externalId?: string,
  ) {
    const transaction = await this.transactionRepository.findTransactionById(transactionId, {
      subscription: true,
      plan: true,
    });

    if (!transaction) throw new NotFoundException('Transaction was not fouded');

    await this.transactionRepository.updateTransactionData(transactionId, {
      status,
      externalId,
    });

    await this.calculateSubscriptionEndDate(status, transaction, billingPeriod, planId);
  }

  public async stripeSubscriptionCreated(dto: CreateStripePaymentSubscriptionEvent) {
    const { sessionMetadata, stripeSubscriptionId, status } = dto;
    const { billingPeriod, planId, transactionId, userId } = sessionMetadata;

    const key = `lock:subscription:created:${transactionId}`;
    const currentTransaction = await this.transactionRepository.findTransactionById(transactionId);

    await this.cacheService.distributedLockOperation(key, async () => {
      if (currentTransaction.status === TransactionStatus.success) {
        return { ok: true };
      }
      await this.subscriptionRepository.updateStripeSubscriptionId(
        userId,
        stripeSubscriptionId,
        transactionId,
      );

      await this.processSubscriptionPayment(transactionId, status, planId, billingPeriod);

      return { ok: true };
    });
  }

  public async stripeSubscriptionRenewed(dto: RenewedStripeSubscriptionEvent) {
    const { billingReason, customerId, externalId, status, eventId } = dto;

    if (billingReason !== 'subscription_cycle') return null;

    const key = `lock:subscription:renewed:${eventId}`;

    await this.cacheService.distributedLockOperation(key, async () => {
      const {
        transactionId,
        externalId: paymentId,
        planId,
        billingPeriod,
      } = await this.handleAutoBilling(customerId, status, externalId);

      await this.processSubscriptionPayment(
        transactionId,
        status,
        planId,
        billingPeriod,
        paymentId,
      );

      return { ok: true };
    });
  }

  public async stripeSubscriptionFailed(dto: FailedStripePaymentSubscriptionEvent) {
    const { billingReason, customerId, externalId, metaData, status } = dto;
    const { paymentId, transactionId } = metaData;

    if (billingReason !== 'subscription_cycle') {
      const { userId, stripeSubscriptionId } = await this.handleAutoBilling(
        customerId,
        status,
        externalId,
      );

      await this.subscriptionRepository.updateStripeSubscriptionId(userId, stripeSubscriptionId);
    }

    const transaction = await this.transactionRepository.findTransactionById(transactionId, {
      subscription: true,
      plan: true,
    });

    if (!transaction) throw new NotFoundException('Transaction was not fouded');

    await this.transactionRepository.updateTransactionData(transactionId, {
      status,
      externalId: paymentId,
    });

    const subscription = transaction.subscription;

    if (status === TransactionStatus.failed) {
      await this.subscriptionRepository.updateSubscription(subscription.id, {
        status: SubscriptionStatus.expired,
      });
    }

    return { ok: true };
  }

  public async liqpaySubscriptionCreated(dto: CreateLiqpayPaymentSubscriptionEvent) {
    const { order_id, payment_id } = dto;
    const token = crypto.randomUUID();
    const key = `lock:subscription:created:${payment_id}`;
    try {
      const lock = await this.cacheService.set(key, token, 'EX', 60, 'NX');

      if (lock === null) {
        return { ok: true };
      }
      const transaction = await this.transactionRepository.findTransactionById(order_id);

      if (!transaction) throw new NotFoundException('Transaction was not fouded');

      const exists = await this.transactionRepository.getTransactionByExternalId(
        String(payment_id),
      );

      if (exists?.status === TransactionStatus.success) {
        return;
      }

      await this.processSubscriptionPayment(
        transaction.id,
        TransactionStatus.success,
        transaction.planId,
        transaction.billingPeriod,
        String(payment_id),
      );
    } finally {
      await this.cacheService.releaseLock(key, token);
    }
  }

  public async handleAutoBilling(
    customerId: string,
    status: TransactionStatus,
    externalId: string,
  ) {
    const user = await this.userRepository.findUserByStripeCustomerId(customerId);

    if (!user) throw new NotFoundException('User was not fouded');

    const lastTransaction = await this.transactionRepository.findLastTransaction(user.id);

    if (!lastTransaction || !lastTransaction.subscriptionId) return;

    const subscription = await this.subscriptionRepository.getSubscriptionByIdAndUserId(
      user.id,
      lastTransaction.subscriptionId,
    );

    if (!subscription) throw new NotFoundException('Subscription was not fouded');

    const existingTransaction =
      await this.transactionRepository.getTransactionByExternalId(externalId);

    if (existingTransaction) {
      return {
        transactionId: existingTransaction.id,
        planId: existingTransaction.planId,
        paymentId: externalId,
        status: existingTransaction.status,
        userId: existingTransaction.userId,
        externalId,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        billingPeriod: existingTransaction.billingPeriod,
      };
    }

    const transaction = await this.transactionRepository.createTransaction({
      amount: lastTransaction.amount,
      billingPeriod: lastTransaction.billingPeriod,
      paymentProvider: PaymentProvider.stripe,
      status,
      externalId,
      transactionType: TransactionType.subscription,
      subscriptionId: subscription.id,
      userId: user.id,
      planId: lastTransaction.planId,
    });

    await this.subscriptionRepository.updateSubscription(subscription.id, {
      transactionId: transaction.id,
    });

    return {
      transactionId: transaction.id,
      planId: transaction.planId,
      paymentId: externalId,
      status: TransactionStatus.success,
      userId: user.id,
      externalId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      billingPeriod: lastTransaction.billingPeriod,
    };
  }

  public async initSubscriptionTransaction(dto: InitSubscriptionTransactionType, userId: string) {
    const { planId, provider, billingPeriod } = dto;

    const plan = await this.planRepository.getPlanById(planId);

    const planProvider = await this.providerRepository.findProviderByNameAndPlan(provider, planId);

    const user = await this.userRepository.findUserById(userId);

    if (!plan || !planProvider || !user) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Plan was not founded',
      });
    }

    const amount = billingPeriod === BillingPeriod.monthly ? plan.monthlyPrice : plan.annualyPrice;

    const subscription = await this.subscriptionRepository.getSubscriptionByUserId(userId);

    if (!subscription) {
      const now = new Date();
      await this.subscriptionRepository.createSubscription({
        planId,
        userId,
        provider,
        stripeSubscriptionId: null,
        billingPeriod,
        status: 'pending',
        currentPeriodEnd: now,
        currentPeriodStart: now,
      });
    }

    const transaction = await this.transactionRepository.createTransaction({
      amount,
      billingPeriod,
      status: 'pending',
      externalId: null,
      transactionType: TransactionType.subscription,
      paymentProvider: provider,
      subscriptionId: subscription.id,
      userId: user.id,
      planId,
    });

    let payment;

    switch (provider) {
      case PaymentProvider.stripe:
        payment = await this.stripeProvider.createSubscriptionPayment({
          userId,
          billingPeriod,
          email: user.email,
          planId,
          priceId: planProvider.externalPriceId,
          transactionId: transaction.id,
        });
        break;
      case PaymentProvider.liqpay:
        payment = await this.liqpayProvider.createSubscriptionPayment({
          amount: +amount,
          currency: 'USD',
          description: plan.description,
          orderId: transaction.id,
          billingPeriod,
          successUrl: 'example.com',
        });
    }

    return {
      cancelUrl: payment['cancel_url'],
      url: payment.url,
      successUrl: payment['success_url'],
    };
  }

  public async updateAutoRenewal(userId: string, isAutoRenewal: boolean) {
    const lastTransaction = await this.transactionRepository.findLastTransaction(userId);
    const subscription = await this.subscriptionRepository.getSubscriptionByUserId(userId);

    if (!lastTransaction) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Transaction was not founded',
      });
    }

    if (lastTransaction.paymentProvider === 'stripe' && subscription.stripeSubscriptionId) {
      await this.stripeProvider.updateAutoRenewal(subscription.id, isAutoRenewal);
    }

    await this.userRepository.updateUser(userId, { isAutoRenewal });

    return { isAutoRenewal };
  }
}
