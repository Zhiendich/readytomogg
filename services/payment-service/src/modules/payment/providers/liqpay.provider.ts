import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Liqpay from 'liqpayjs-sdk';
import qs from 'qs';
import { lastValueFrom } from 'rxjs';
import { AllConfigs } from 'src/config';

import { CreateLiqpayPaymentDto, CreateSubscriptionLiqpayPaymentDto } from '../payment.type';

@Injectable()
export class LiqpayProvider {
  private liqpay: Liqpay;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly serverUrl: string;

  constructor(
    private readonly configService: ConfigService<AllConfigs>,
    private readonly httpService: HttpService,
  ) {
    this.publicKey = configService.get('providers.liqpay_public_key', { infer: true });
    this.privateKey = configService.get('providers.liqpay_private_key', { infer: true });
    this.liqpay = new Liqpay(this.publicKey, this.privateKey);
    this.serverUrl = configService.get('providers.liqpay_server_url', { infer: true });
  }

  private async createRedirectUrl(data: string, signature: string) {
    const response = await lastValueFrom(
      this.httpService.post(
        'https://www.liqpay.ua/api/3/checkout',
        qs.stringify({
          data,
          signature,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          maxRedirects: 0,
          validateStatus: (status) => status === 302 || status === 303,
        },
      ),
    );

    return response.headers.location;
  }

  public async createSubscriptionPayment(dto: CreateSubscriptionLiqpayPaymentDto) {
    const billingPeriod = dto.billingPeriod === 'annualy' ? 'year' : 'month';

    const now = new Date();
    const subscribe_date_start = now.toISOString().replace('T', ' ').slice(0, 19);

    const params = {
      version: '3',
      action: 'subscribe',

      amount: dto.amount,
      currency: dto.currency,

      description: dto.description,
      order_id: dto.orderId,

      result_url: dto.successUrl,
      subscribe_date_start,
      subscribe_periodicity: billingPeriod,
      server_url: this.serverUrl,
    };

    const data = this.liqpay.cnb_params(params);

    const dataBuffer = Buffer.from(JSON.stringify(params)).toString('base64');

    const signature = this.liqpay.cnb_signature(data);

    const url = await this.createRedirectUrl(dataBuffer, signature);

    return {
      url,
    };
  }

  public async createPayment(dto: CreateLiqpayPaymentDto) {}
}
