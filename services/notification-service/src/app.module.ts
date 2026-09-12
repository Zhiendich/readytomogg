import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { rmqEnv, smsEnv, smtpEnv } from './config';
import { MailModule } from './infrastructure/mail/mail.module';
import { RmqModule } from './infrastructure/rmq/consumer/rmq.module';
import { SmsModule } from './infrastructure/sms/sms.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ObservabilityModule } from './observability/observability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env.dev',
      load: [rmqEnv, smtpEnv, smsEnv],
    }),
    ObservabilityModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL,
        transport: {
          target: 'pino/file',
          options: {
            destination: './logs/auth/auth.log',
            mkdir: true,
          },
        },
        messageKey: 'msg',
        customProps: () => ({ service: 'notification-service' }),
      },
    }),
    RmqModule,
    NotificationModule,
    MailModule,
    SmsModule,
  ],
})
export class AppModule {}
