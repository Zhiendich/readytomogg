export enum EventTypeEnum {
  SESSION_COMPLETED = "checkout.session.completed",
  PAYMENT_SUCCEEDED = "invoice.payment_succeeded",
  PAYMENT_FAILED = "invoice.payment_failed",
}

export enum BillingReasonEnum {
  subscription_cycle = "subscription_cycle",
}

export enum BillingPeriod {
  monthly = "monthly",
  annualy = "annualy",
}

export enum TransactionStatus {
  success = "success",
  failed = "failed",
  processing = "processing",
  pending = "pending",
  refunded = "refunded",
}
