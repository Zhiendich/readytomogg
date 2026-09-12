import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  type CreateLiqpayPaymentSubscriptionEvent,
  type CreateStripePaymentSubscriptionEvent,
  EVENT_CONSTANTS,
  type FailedStripePaymentSubscriptionEvent,
  type RenewedStripeSubscriptionEvent,
} from '@readytomog/contracts';
import { RmqService } from 'src/infrastructure/rmq/consumer/rmq.service';

import { SubscriptionService } from './subscription/subscription.service';

@Controller()
export class PaymentConsumer {
  private logger = new Logger(PaymentConsumer.name);
  constructor(
    private readonly rmqService: RmqService,
    private readonly subscriptionService: SubscriptionService,
  ) {}
  @EventPattern(EVENT_CONSTANTS.stripeSubscriptionCreated)
  public async stripeSubscriptionCreated(
    @Payload() payload: CreateStripePaymentSubscriptionEvent,
    @Ctx() ctx: RmqContext,
  ) {
    try {
      await this.subscriptionService.stripeSubscriptionCreated(payload);
      await this.rmqService.ack(ctx);
    } catch (error) {
      this.logger.error('ERROR:', error);
      await this.rmqService.nack(ctx);
    }
  }

  @EventPattern(EVENT_CONSTANTS.stripeSubsscriptionRenewed)
  public async stripeSubscriptionRenewed(
    @Payload() payload: RenewedStripeSubscriptionEvent,
    @Ctx() ctx: RmqContext,
  ) {
    try {
      await this.subscriptionService.stripeSubscriptionRenewed(payload);
      await this.rmqService.ack(ctx);
    } catch (error) {
      this.logger.error('ERROR:', error);
      await this.rmqService.nack(ctx);
    }
  }

  @EventPattern(EVENT_CONSTANTS.stripeSubsscriptionFailed)
  public async stripeSubscriptionFailed(
    @Payload() payload: FailedStripePaymentSubscriptionEvent,
    @Ctx() ctx: RmqContext,
  ) {
    try {
      await this.subscriptionService.stripeSubscriptionFailed(payload);
      await this.rmqService.ack(ctx);
    } catch (error) {
      this.logger.error('ERROR:', error);
      await this.rmqService.nack(ctx);
    }
  }

  @EventPattern(EVENT_CONSTANTS.liqpaySubscriptionCreated)
  public async liqpaySubscriptionCreated(
    @Payload() payload: CreateLiqpayPaymentSubscriptionEvent,
    @Ctx() ctx: RmqContext,
  ) {
    try {
      await this.subscriptionService.liqpaySubscriptionCreated(payload);
      await this.rmqService.ack(ctx);
    } catch (error) {
      this.logger.error('ERROR:', error);
      await this.rmqService.nack(ctx);
    }
  }
}
