import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { rmqEnv, smsEnv, smtpEnv } from './config';
import { MailModule } from './infrastructure/mail/mail.module';
import { RmqModule } from './infrastructure/rmq/consumer/rmq.module';
import { SmsModule } from './infrastructure/sms/sms.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rmqEnv, smtpEnv, smsEnv],
    }),
    RmqModule,
    NotificationModule,
    MailModule,
    SmsModule,
  ],
})
export class AppModule {}
