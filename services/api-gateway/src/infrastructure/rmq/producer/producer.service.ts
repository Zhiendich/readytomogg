import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateLiqpayPaymentSubscriptionEvent,
  CreateStripePaymentSubscriptionEvent,
  EVENT_CONSTANTS,
  FailedStripePaymentSubscriptionEvent,
  RenewedStripeSubscriptionEvent,
  SendMessageEvent,
} from '@readytomog/contracts';

@Injectable()
export class ProducerService {
  constructor(
    @Inject('CHAT_CLIENT') private readonly chatClient: ClientProxy,
    @Inject('PAYMENT_CLIENT') private readonly paymentClient: ClientProxy,
  ) {}

  public sendMessage(data: SendMessageEvent) {
    this.chatClient.emit(EVENT_CONSTANTS.sendChatMessage, data);
  }

  public createStripeSubscription(data: CreateStripePaymentSubscriptionEvent) {
    this.paymentClient.emit(EVENT_CONSTANTS.stripeSubscriptionCreated, data);
  }

  public renewedStripeSubscription(data: RenewedStripeSubscriptionEvent) {
    this.paymentClient.emit(EVENT_CONSTANTS.stripeSubsscriptionRenewed, data);
  }

  public failedStripeSubscription(data: FailedStripePaymentSubscriptionEvent) {
    this.paymentClient.emit(EVENT_CONSTANTS.stripeSubsscriptionFailed, data);
  }

  public createLiqpaySubscription(data: CreateLiqpayPaymentSubscriptionEvent) {
    this.paymentClient.emit(EVENT_CONSTANTS.liqpaySubscriptionCreated, data);
  }
}
