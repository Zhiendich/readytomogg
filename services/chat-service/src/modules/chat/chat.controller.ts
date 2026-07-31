import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, GrpcMethod, Payload, RmqContext } from '@nestjs/microservices';
import { CurrentGrpcUser, type JwtPayload, SetGrpcMetadata } from '@readytomog/common';
import {
  type CreateChatRequest,
  type CreateChatResponse,
  type DeleteChatRequest,
  type DeleteChatResponse,
  EVENT_CONSTANTS,
  type GetChatsRequest,
  type GetChatsResponse,
  type GetMessagesRequest,
  type GetMessagesResponse,
  type SendMessageEvent,
} from '@readytomog/contracts';
import { RmqService } from 'src/infrastructure/rmq/consumer/rmq.service';

import { ChatService } from './chat.service';

@UseInterceptors(SetGrpcMetadata)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly rmqService: RmqService,
  ) {}

  @GrpcMethod('ChatService', 'CreateChat')
  public async createChat(
    @Payload() dto: CreateChatRequest,
    @CurrentGrpcUser() user: JwtPayload,
  ): Promise<CreateChatResponse> {
    return await this.chatService.createChat(user.id, dto.participant);
  }

  @GrpcMethod('ChatService', 'DeleteChat')
  public async deleteChat(
    @CurrentGrpcUser() user: JwtPayload,
    @Payload() dto: DeleteChatRequest,
  ): Promise<DeleteChatResponse> {
    return await this.chatService.deleteChat(user.id, dto.chatId);
  }

  @GrpcMethod('ChatService', 'GetChats')
  public async getChatsList(
    @Payload() dto: GetChatsRequest,
    @CurrentGrpcUser() user: JwtPayload,
  ): Promise<GetChatsResponse> {
    return await this.chatService.getChatsList(dto.userId, user.id);
  }

  @GrpcMethod('ChatService', 'GetMessages')
  public async getChatMessages(
    @CurrentGrpcUser() user: JwtPayload,
    @Payload() dto: GetMessagesRequest,
  ): Promise<GetMessagesResponse> {
    return await this.chatService.getChatMessages(user.id, dto.chatId);
  }

  @EventPattern(EVENT_CONSTANTS.sendChatMessage)
  public async sendMessage(@Payload() dto: SendMessageEvent, @Ctx() context: RmqContext) {
    try {
      await this.chatService.sendMessage(dto);
      await this.rmqService.ack(context);
    } catch (error) {
      await this.rmqService.nack(context);
    }
  }
}
