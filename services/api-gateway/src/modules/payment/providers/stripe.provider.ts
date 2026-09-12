import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigs } from 'src/config';
import Stripe from 'stripe';

@Injectable()
export class StripeProvider {
  private stripe!: InstanceType<typeof Stripe>;
  private WEBHOOK_SECRET!: string;

  constructor(private readonly configService: ConfigService<AllConfigs>) {
    const stripe_key = this.configService.get('providers.stripe_key', { infer: true });
    this.stripe = new Stripe(stripe_key, {
      typescript: true,
      apiVersion: '2026-07-29.dahlia',
    });

    this.WEBHOOK_SECRET = this.configService.get('providers.stripe_webhook_secret', {
      infer: true,
    });
  }

  public async checkStripeEvent(rawBody: Buffer, signature: string | string[]) {
    try {
      return this.stripe.webhooks.constructEvent(rawBody, signature, this.WEBHOOK_SECRET);
    } catch (error) {
      throw new ForbiddenException('Stripe validation');
    }
  }
}
