import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AllConfigs } from 'src/config';

import { SendSmsRequest, SendSmsResponse } from './interfaces/send-sms.interface';

@Injectable()
export class SmsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<AllConfigs>,
  ) {}

  public async sendSMSMessage(otp: number, phone: string) {
    try {
      const body: SendSmsRequest = {
        phone: [phone],
        src_addr: this.configService.get('sms.sender', { infer: true }),
        message: `Your otp code: ${otp}`,
      };

      await lastValueFrom(
        this.httpService.post<SendSmsResponse>('https://im.smsclub.mobi/sms/send', body, {
          headers: {
            Authorization: `Bearer ${this.configService.get('sms.provider_token', { infer: true })}`,
          },
        }),
      );
    } catch (error: any) {
      console.log('ERROR', error);
    }
  }
}
