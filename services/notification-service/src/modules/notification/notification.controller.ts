import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  EVENT_CONSTANTS,
  type SendEmailOtpEvent,
  type SendSmsOtpEvent,
} from '@readytomog/contracts';
import { RmqService } from 'src/infrastructure/rmq/consumer/rmq.service';

import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern(EVENT_CONSTANTS.emailSend)
  public async sendEmail(@Payload() payload: SendEmailOtpEvent, @Ctx() ctx: RmqContext) {
    try {
      await this.notificationService.sendMail(payload);
      await this.rmqService.ack(ctx);
    } catch (error) {
      console.log('ERROR: ', error);
      await this.rmqService.nack(ctx);
    }
  }

  @EventPattern(EVENT_CONSTANTS.smsSend)
  public async sendSms(@Payload() payload: SendSmsOtpEvent, @Ctx() ctx: RmqContext) {
    try {
      await this.notificationService.sendSms(payload);
      await this.rmqService.ack(ctx);
    } catch (error) {
      console.log('ERROR: ', error);
      await this.rmqService.nack(ctx);
    }
  }
}
