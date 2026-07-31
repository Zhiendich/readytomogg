import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  private readonly logger = new Logger(RmqService.name);
  public async ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    const tag = message?.fields?.deliveryTag;

    if (!tag) return;

    channel.ack(message);
    this.logger.debug(`Ack (pattern:  ${context.getPattern()}, tag : ${tag})`);
  }

  public async nack(context: RmqContext, requeue = false) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    const tag = message?.fields?.deliveryTag;

    if (!tag) return;

    channel.nack(message, false, requeue);

    if (requeue) {
      this.logger.warn(`Nack response (pattern:  ${context.getPattern()}, tag : ${tag})`);
    } else {
      this.logger.error(`Nack drop (pattern:  ${context.getPattern()}, tag : ${tag})`);
    }
  }
}
