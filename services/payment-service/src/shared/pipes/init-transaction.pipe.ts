import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { BillingPeriod, PaymentProvider } from '@prisma/client';
import { validateEnumValues } from '@readytomog/common';
import { InitSubscriptionTransactionRequest } from '@readytomog/contracts';
import { InitSubscriptionTransactionType } from 'src/modules/payment/payment.type';

export class InitSubscriptionTransactionPipe implements PipeTransform {
  transform(
    value: InitSubscriptionTransactionRequest,
    metadata: ArgumentMetadata,
  ): InitSubscriptionTransactionType {
    const validatedProvider = validateEnumValues(PaymentProvider, [value.provider])[0];
    const validatedBillingPeriod = validateEnumValues(BillingPeriod, [value.billingPeriod])[0];

    return { ...value, provider: validatedProvider, billingPeriod: validatedBillingPeriod };
  }
}
