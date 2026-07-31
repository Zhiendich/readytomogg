import { Module } from '@nestjs/common';
import { MailService } from 'src/infrastructure/mail/mail.service';
import { SmsModule } from 'src/infrastructure/sms/sms.module';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [SmsModule],
  controllers: [NotificationController],
  providers: [NotificationService, MailService],
})
export class NotificationModule {}
