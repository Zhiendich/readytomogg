import { Module } from '@nestjs/common';

import { GetTransactionHistoryMapper } from './mappers/get-transaction-history.mapper';
import { PaymentConsumer } from './payment.consumer';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ProvidersModule } from './providers/providers.module';
import { SubscriptionCron } from './subscription/cron.service';
import { SubscriptionService } from './subscription/subscription.service';

@Module({
  controllers: [PaymentController, PaymentConsumer],
  providers: [
    PaymentService,
    SubscriptionService,
    PaymentConsumer,
    SubscriptionCron,
    GetTransactionHistoryMapper,
  ],
  imports: [ProvidersModule],
})
export class PaymentModule {}
