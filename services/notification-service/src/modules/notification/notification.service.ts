import { Injectable } from '@nestjs/common';
import { SendEmailOtpEvent, SendSmsOtpEvent } from '@readytomog/contracts';
import { MailService } from 'src/infrastructure/mail/mail.service';
import { SmsService } from 'src/infrastructure/sms/sms.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
  ) {}

  public async sendMail(data: SendEmailOtpEvent) {
    await this.mailService.sendOtp(data.email, data.otp);
  }
  public async sendSms(data: SendSmsOtpEvent) {
    await this.smsService.sendSMSMessage(data.otp, data.phone);
  }
}
