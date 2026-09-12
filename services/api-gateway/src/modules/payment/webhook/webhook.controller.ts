import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from 'src/shared/decorators/public.decorator';
import { RateLimitOff } from 'src/shared/decorators/rate-limit-off.decorator';

import { LiqpayProvider } from '../providers/liqpay.provider';
import { StripeProvider } from '../providers/stripe.provider';

import { WebHookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebHookService,
    private readonly stripeProvider: StripeProvider,
    private readonly liqpayProvider: LiqpayProvider,
  ) {}

  @RateLimitOff()
  @Public()
  @Post('stripe')
  public async handlerStripeWebhook(@Req() req: Request & { rawBody: Buffer }) {
    const stripeToken = req.headers['stripe-signature'] || '';
    const event = await this.stripeProvider.checkStripeEvent(req.rawBody, stripeToken);

    if (!event) return { ok: false };
    await this.webhookService.handleStripeWebhook(event);
    return { ok: true };
  }

  @RateLimitOff()
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('liqpay')
  public async handlerLiqpayWebhook(@Body() dto: { signature: string; data: string }) {
    const event = await this.liqpayProvider.checkLiqpayEvent(dto.signature, dto.data);
    if (!event) return { ok: false };

    await this.webhookService.handleLiqpayWebhook(event);

    return { ok: true };
  }
}
