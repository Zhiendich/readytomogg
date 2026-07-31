import { Module } from '@nestjs/common';
import { GrpcModule } from '@readytomog/common';

import { PaymentController } from './payment.controller';
import { PaymentGrpcClient } from './payment.grpc';
import { ProvidersModule } from './providers/providers.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [GrpcModule.register(['PAYMENT_PACKAGE']), ProvidersModule, WebhookModule],
  controllers: [PaymentController],
  providers: [PaymentGrpcClient],
})
export class PaymentModule {}
