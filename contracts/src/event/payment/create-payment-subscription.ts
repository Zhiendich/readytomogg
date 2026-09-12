import { BillingPeriod, TransactionStatus } from "./stripe-webhook";

export interface StripeSessionMetadata {
  transactionId: string;
  planId: string;
  billingPeriod: BillingPeriod;
  userId: string;
}

export interface CreateStripePaymentSubscriptionEvent {
  sessionMetadata: StripeSessionMetadata;
  eventId: string;
  status: TransactionStatus;
  stripeSubscriptionId: string;
}

export interface CreateLiqpayPaymentSubscriptionEvent {
  payment_id: string;
  action: string;
  order_id: string;
}
