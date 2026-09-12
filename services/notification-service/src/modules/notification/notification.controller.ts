import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  EVENT_CONSTANTS,
  type SendEmailOtpEvent,
  type SendSmsOtpEvent,
} from '@readytomog/contracts';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { RmqService } from 'src/infrastructure/rmq/consumer/rmq.service';

import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  private readonly SERVICE_NAME: string;
  constructor(
    private readonly notificationService: NotificationService,
    private readonly rmqService: RmqService,
    @InjectMetric('rmq_event_processing_duration_seconds')
    private readonly processingDuration: Histogram<string>,
    @InjectMetric('rmq_events_total')
    private readonly eventsTotal: Counter<string>,
  ) {
    this.SERVICE_NAME = 'notification-service';
  }

  @EventPattern(EVENT_CONSTANTS.emailSend)
  public async sendEmail(@Payload() payload: SendEmailOtpEvent, @Ctx() ctx: RmqContext) {
    console.log('CALLED', payload);
    const endTimer = this.processingDuration.startTimer({
      service: this.SERVICE_NAME,
      event: EVENT_CONSTANTS.emailSend,
    });
    try {
      await this.notificationService.sendMail(payload);

      this.eventsTotal.inc({
        service: this.SERVICE_NAME,
        event: EVENT_CONSTANTS.emailSend,
        status: 'success',
      });
      await this.rmqService.ack(ctx, EVENT_CONSTANTS.emailSend);
    } catch (error) {
      console.log('ERROR: ', error);
      this.eventsTotal.inc({
        service: this.SERVICE_NAME,
        event: EVENT_CONSTANTS.emailSend,
        status: 'error',
      });
      await this.rmqService.nack(ctx, EVENT_CONSTANTS.emailSend);
    } finally {
      endTimer();
    }
  }

  @EventPattern(EVENT_CONSTANTS.smsSend)
  public async sendSms(@Payload() payload: SendSmsOtpEvent, @Ctx() ctx: RmqContext) {
    const endTimer = this.processingDuration.startTimer({
      service: this.SERVICE_NAME,
      event: EVENT_CONSTANTS.smsSend,
    });
    try {
      await this.notificationService.sendSms(payload);
      this.eventsTotal.inc({
        service: this.SERVICE_NAME,
        event: EVENT_CONSTANTS.smsSend,
        status: 'success',
      });
      await this.rmqService.ack(ctx, EVENT_CONSTANTS.smsSend);
    } catch (error) {
      console.log('ERROR: ', error);
      this.eventsTotal.inc({
        service: this.SERVICE_NAME,
        event: EVENT_CONSTANTS.smsSend,
        status: 'error',
      });
      await this.rmqService.nack(ctx, EVENT_CONSTANTS.smsSend);
    } finally {
      endTimer();
    }
  }
}
