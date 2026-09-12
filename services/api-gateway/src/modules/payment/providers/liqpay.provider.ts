import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Liqpay from 'liqpayjs-sdk';
import { AllConfigs } from 'src/config';
import { LiqpayWebhookPayload } from 'src/types/webhook.type';

@Injectable()
export class LiqpayProvider {
  private liqpay: Liqpay;
  private readonly publicKey: string;
  private readonly privateKey: string;

  constructor(private readonly configService: ConfigService<AllConfigs>) {
    this.publicKey = configService.get('providers.liqpay_public_key', { infer: true });
    this.privateKey = configService.get('providers.liqpay_private_key', { infer: true });
    this.liqpay = new Liqpay(this.publicKey, this.privateKey);
  }

  public async checkLiqpayEvent(signature: string, data: string) {
    const checkSignature = this.liqpay.str_to_sign(this.privateKey + data + this.privateKey);
    if (signature !== checkSignature) {
      throw new ForbiddenException('Incorrect signature');
    }

    const payload: LiqpayWebhookPayload = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));

    return payload;
  }
}
