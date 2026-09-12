import {
  BillingPeriod,
  BillingReasonEnum,
  TransactionStatus,
} from "./stripe-webhook";

export interface StripeInvoiceMetadata {
  planId: string;
  billingPeriod: BillingPeriod;
  userId: string;
}

export interface RenewedStripeSubscriptionEvent {
  billingReason: BillingReasonEnum;
  customerId: string;
  invoiceMetadata: StripeInvoiceMetadata;
  eventId: string;
  externalId: string;
  status: TransactionStatus;
}
