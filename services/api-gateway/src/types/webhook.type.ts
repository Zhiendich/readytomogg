import {
  BillingReasonEnum,
  EventTypeEnum,
  StripeEventMetadata,
  StripeInvoiceMetadata,
  StripeSessionMetadata,
} from '@readytomog/contracts';

export function isStripeSessionMetadata(metadata: unknown): metadata is StripeSessionMetadata {
  if (!metadata || typeof metadata !== 'object') {
    return false;
  }

  const value = metadata as Record<string, unknown>;

  return (
    typeof value.transactionId === 'string' &&
    typeof value.planId === 'string' &&
    typeof value.billingPeriod === 'string' &&
    typeof value.userId === 'string'
  );
}

export function isStripeInvoiceMetadata(metadata: unknown): metadata is StripeInvoiceMetadata {
  if (!metadata || typeof metadata !== 'object') {
    return false;
  }

  const value = metadata as Record<string, unknown>;

  return (
    typeof value.planId === 'string' &&
    typeof value.billingPeriod === 'string' &&
    typeof value.userId === 'string'
  );
}

export function isStripeEventMetadata(metadata: unknown): metadata is StripeEventMetadata {
  if (!metadata || typeof metadata !== 'object') {
    return false;
  }

  const value = metadata as Record<string, unknown>;

  return (
    typeof value.transactionId === 'string' &&
    typeof value.planId === 'string' &&
    typeof value.paymentId === 'string'
  );
}

const billingReasons: readonly string[] = Object.values(BillingReasonEnum);

export function isBillingReason(value: unknown): value is BillingReasonEnum {
  return typeof value === 'string' && billingReasons.includes(value);
}

const stripeEventTypes: readonly string[] = Object.values(EventTypeEnum);

export function isStripeEventType(value: unknown): value is EventTypeEnum {
  return typeof value === 'string' && stripeEventTypes.includes(value);
}

export interface LiqpayWebhookPayload {
  payment_id: string;
  action: 'pay' | 'subscribe';
  status: string;

  version: number;
  type: string;
  paytype: string;

  public_key: string;
  acq_id: number;

  order_id: string;
  liqpay_order_id: string;

  description: string;

  sender_first_name: string;
  sender_last_name: string;

  sender_card_mask2: string;
  sender_card_bank: string;
  sender_card_type: string;
  sender_card_country: number;

  ip: string;

  amount: number;
  currency: string;

  sender_commission: number;
  receiver_commission: number;
  agent_commission: number;

  amount_debit: number;
  amount_debit_total: number;
  amount_credit: number;

  commission_debit: number;
  commission_credit: number;

  currency_debit: string;
  currency_credit: string;

  sender_bonus: number;
  amount_bonus: number;

  mpi_eci: string;
  is_3ds: boolean;

  language: string;

  create_date: number;
  end_date: number;

  transaction_id: number;
}

export const isLiqpayEvent = (event: LiqpayWebhookPayload) => {
  if (typeof event !== 'object' || !event['payment_id'] || !event['action'] || !event['order_id'])
    return false;

  return true;
};
