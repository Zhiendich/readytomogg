import { BillingPeriod, PaymentProvider, TransactionStatus, TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import { BaseMapper, validateEnumValues } from '@readytomog/common';
import { GetHistoryResponse } from '@readytomog/contracts';

export interface GetHistoryData {
  transactions: {
    id: string;
    status: TransactionStatus;
    paymentProvider: PaymentProvider;
    createdAt: Date;
    updatedAt: Date;
    billingPeriod: BillingPeriod;
    amount: Decimal;
    userId: string;
    planId?: string;
    subscriptionId?: string | null;
  }[];
}

export class GetTransactionHistoryMapper extends BaseMapper<GetHistoryData, GetHistoryResponse> {
  toData(data: GetHistoryResponse): GetHistoryData {
    return {
      transactions: data.transactions.map((t) => ({
        ...t,
        amount: Decimal(t.amount),
        createdAt: new Date(t.createdAt),
        status: validateEnumValues(TransactionStatus, [t.status])[0],
        paymentProvider: validateEnumValues(PaymentProvider, [t.paymentProvider])[0],
        billingPeriod: validateEnumValues(BillingPeriod, [t.billingPeriod])[0],
        updatedAt: new Date(t.updatedAt),
      })),
    };
  }

  toDomain(data: GetHistoryData): GetHistoryResponse {
    return {
      transactions: data.transactions.map((t) => ({
        ...t,
        amount: +t.amount,
        transactionType: TransactionType.subscription,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
    };
  }
}
