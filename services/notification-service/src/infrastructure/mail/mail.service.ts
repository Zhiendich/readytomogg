import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendOtp(email: string, otp: number) {
    const html = `<h1>Yout otp code: ${otp}</h1>`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your otp code',
      html,
    });
  }
}
