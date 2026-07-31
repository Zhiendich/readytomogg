import { BadRequestException, Injectable } from '@nestjs/common';
import { EventTypeEnum, TransactionStatus } from '@readytomog/contracts';
import { ProducerService } from 'src/infrastructure/rmq/producer/producer.service';
import {
  LiqpayWebhookPayload,
  isBillingReason,
  isLiqpayEvent,
  isStripeEventMetadata,
  isStripeEventType,
  isStripeInvoiceMetadata,
  isStripeSessionMetadata,
} from 'src/types/webhook.type';
import Stripe from 'stripe';

@Injectable()
export class WebHookService {
  constructor(private readonly producerService: ProducerService) {}

  public async handleStripeWebhook(event: Stripe.Event) {
    if (!isStripeEventType(event.type)) return;

    switch (event.type) {
      case EventTypeEnum.SESSION_COMPLETED: {
        const session = event.data.object;
        const stripeSubscriptionId = session.subscription as string;

        if (isStripeSessionMetadata(session.metadata)) {
          this.producerService.createStripeSubscription({
            sessionMetadata: session.metadata,
            eventId: event.id,
            stripeSubscriptionId,
            status: TransactionStatus.success,
          });
        }

        return;
      }

      case EventTypeEnum.PAYMENT_SUCCEEDED: {
        const invoice = event.data.object;

        if (!isBillingReason(invoice.billing_reason) || !isStripeInvoiceMetadata(invoice.metadata))
          throw new BadRequestException('Incorect billing reason');

        this.producerService.renewedStripeSubscription({
          billingReason: invoice.billing_reason,
          eventId: event.id,
          customerId: invoice.customer as string,
          invoiceMetadata: invoice.metadata,
          externalId: invoice.id,
          status: TransactionStatus.success,
        });

        return;
      }

      case EventTypeEnum.PAYMENT_FAILED: {
        const invoice = event.data.object;

        if (!isBillingReason(invoice.billing_reason) || !isStripeEventMetadata(invoice.metadata))
          throw new BadRequestException('Incorect billing reason or metadata');
        this.producerService.failedStripeSubscription({
          billingReason: invoice.billing_reason,
          eventId: event.id,
          customerId: invoice.customer as string,
          externalId: invoice.id,
          metaData: invoice.metadata,
          status: TransactionStatus.failed,
        });

        return;
      }
    }
  }

  public async handleLiqpayWebhook(event: LiqpayWebhookPayload) {
    if (!isLiqpayEvent(event)) return;
    this.producerService.createLiqpaySubscription({
      action: event.action,
      order_id: event.order_id,
      payment_id: event.payment_id,
    });
  }
}
