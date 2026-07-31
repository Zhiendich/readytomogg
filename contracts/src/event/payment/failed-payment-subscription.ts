import { BillingReasonEnum, TransactionStatus } from "./stripe-webhook";

export interface StripeEventMetadata {
  transactionId: string;
  planId: string;
  paymentId: string;
}

export interface FailedStripePaymentSubscriptionEvent {
  billingReason: BillingReasonEnum;
  customerId: string;
  externalId: string;
  eventId: string;
  status: TransactionStatus;
  metaData: StripeEventMetadata;
}
