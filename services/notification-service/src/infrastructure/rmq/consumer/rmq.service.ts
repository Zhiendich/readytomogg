import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class RmqService {
  private readonly SERVICE_NAME: string;
  private readonly logger = new Logger(RmqService.name);

  constructor(
    @InjectMetric('rmq_events_ack_total') private readonly ackTotal: Counter<string>,
    @InjectMetric('rmq_events_nack_total') private readonly nackTotal: Counter<string>,
  ) {
    this.SERVICE_NAME = 'notification-service';
  }

  public async ack(context: RmqContext, event: string) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    const tag = message?.fields?.deliveryTag;

    if (!tag) return;

    channel.ack(message);

    this.ackTotal.inc({
      service: this.SERVICE_NAME,
      event,
    });

    this.logger.debug(`Ack (pattern:  ${context.getPattern()}, tag : ${tag})`);
  }

  public async nack(context: RmqContext, event: string, requeue = false) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    const tag = message?.fields?.deliveryTag;

    if (!tag) return;

    channel.nack(message, false, requeue);

    this.nackTotal.inc({
      service: this.SERVICE_NAME,
      event,
    });

    if (requeue) {
      this.logger.warn(`Nack response (pattern:  ${context.getPattern()}, tag : ${tag})`);
    } else {
      this.logger.error(`Nack drop (pattern:  ${context.getPattern()}, tag : ${tag})`);
    }
  }
}
