import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateUserEvent,
  EVENT_CONSTANTS,
  SendEmailOtpEvent,
  SendSmsOtpEvent,
  UpdateUserEvent,
} from '@readytomog/contracts';

@Injectable()
export class ProducerService {
  public constructor(
    @Inject('NOTIFICATION_CLIENT')
    private readonly notificationClient: ClientProxy,
    @Inject('USER_CLIENT') private readonly userClient: ClientProxy,
    @Inject('CHAT_CLIENT') private readonly chatClient: ClientProxy,
    @Inject('PAYMENT_CLIENT') private readonly paymentClient: ClientProxy,
  ) {}

  public async createUser(data: CreateUserEvent) {
    this.userClient.emit(EVENT_CONSTANTS.createUser, data);
    this.chatClient.emit(EVENT_CONSTANTS.createUser, data);
    this.paymentClient.emit(EVENT_CONSTANTS.createUser, data);
  }

  public async sendTwoFactorStatus(data: UpdateUserEvent) {
    this.userClient.emit(EVENT_CONSTANTS.change2FA, data);
  }

  public async sendOtpMail(data: SendEmailOtpEvent) {
    this.notificationClient.emit(EVENT_CONSTANTS.emailSend, data);
  }

  public async sendOtpSms(data: SendSmsOtpEvent) {
    this.notificationClient.emit(EVENT_CONSTANTS.smsSend, data);
  }

  public async updateUser(data: UpdateUserEvent) {
    this.userClient.emit(EVENT_CONSTANTS.updateUser, data);
    this.chatClient.emit(EVENT_CONSTANTS.updateUser, data);
    this.paymentClient.emit(EVENT_CONSTANTS.updateUser, data);
  }
}
