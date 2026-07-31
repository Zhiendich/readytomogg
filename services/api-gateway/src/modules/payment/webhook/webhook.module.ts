import { Module } from '@nestjs/common';

import { ProvidersModule } from '../providers/providers.module';

import { WebhookController } from './webhook.controller';
import { WebHookService } from './webhook.service';

@Module({
  imports: [ProvidersModule],
  controllers: [WebhookController],
  providers: [WebHookService],
})
export class WebhookModule {}
