import { Module } from '@nestjs/common';

import { LiqpayProvider } from './liqpay.provider';
import { StripeProvider } from './stripe.provider';

@Module({
  providers: [StripeProvider, LiqpayProvider],
  exports: [StripeProvider, LiqpayProvider],
})
export class ProvidersModule {}
