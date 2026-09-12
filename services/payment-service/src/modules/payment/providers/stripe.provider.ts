import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigs } from 'src/config';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import Stripe from 'stripe';

import { CreateStripePayment, CreateSubscriptionStripePayment } from '../payment.type';

@Injectable()
export class StripeProvider {
  private stripe!: InstanceType<typeof Stripe>;

  constructor(
    private readonly configService: ConfigService<AllConfigs>,

    private readonly userRepository: UserRepository,
  ) {
    const stripe_key = this.configService.get('providers.stripe_key', { infer: true });
    this.stripe = new Stripe(stripe_key, {
      typescript: true,
      apiVersion: '2026-07-29.dahlia',
    });
  }

  public async createPayment(dto: CreateStripePayment) {}

  public async createSubscriptionPayment(dto: CreateSubscriptionStripePayment) {
    const { billingPeriod, email, planId, priceId, transactionId, userId } = dto;

    const user = await this.userRepository.findUserById(userId);

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email,
      });

      await this.userRepository.updateUser(userId, {
        stripeCustomerId: customer.id,
      });

      customerId = customer.id;
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://example.com/',
      cancel_url: 'https://example.com/',

      metadata: {
        transactionId,
        planId,
        userId,
        priceId,
        billingPeriod,
      },
      subscription_data: {
        metadata: {
          planId,
          userId,
          billingPeriod,
          priceId,
        },
      },
    });
    return session;
  }

  public async updateAutoRenewal(subscriptionId: string, isAutoRenewal: boolean) {
    await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: !isAutoRenewal,
    });
  }
}
