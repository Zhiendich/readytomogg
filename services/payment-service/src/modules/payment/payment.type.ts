import { BillingPeriod, PaymentProvider, Prisma } from '@prisma/client';

export interface CreateSubscriptionStripePayment {
  userId: string;
  billingPeriod: BillingPeriod;
  email: string;
  transactionId: string;
  planId: string;
  priceId: string;
}

export interface CreateSubscriptionLiqpayPaymentDto {
  amount: number;
  currency: 'UAH' | 'USD';
  description: string;
  orderId: string;
  billingPeriod: BillingPeriod;
  successUrl: string;
}

export interface InitSubscriptionTransactionType {
  billingPeriod: BillingPeriod;
  provider: PaymentProvider;
  planId: string;
}

export interface ProductItem {
  product_id: string;
  quantity: number;
}

export interface InitTransactionType {
  products: ProductItem[];
  provider: PaymentProvider;
}

export type TransactionWithSubscription = Prisma.TransactionsGetPayload<{
  include: {
    subscription: true;
    plan: true;
  };
}>;

export interface CreateStripePayment {
  email: string;
  productId: string;
  priceId: string;
  transactionId: string;
  userId: string;
}
export interface CreateLiqpayPaymentDto {
  amount: number;
  currency: 'USD' | 'UAH';
  description: string;
  orderId: string;
}
