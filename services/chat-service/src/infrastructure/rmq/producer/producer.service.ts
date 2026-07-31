import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageEvent, EVENT_CONSTANTS } from '@readytomog/contracts';

@Injectable()
export class ProducerService {
  constructor(@Inject('GATEWAY_CLIENT') private readonly chatClient: ClientProxy) {}

  public messageCreated(data: CreateMessageEvent) {
    this.chatClient.emit(EVENT_CONSTANTS.messageCreated, data);
  }
}
