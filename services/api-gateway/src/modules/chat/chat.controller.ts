import { Body, Controller, Delete, Get, Param, Post, Req, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  type CreateChatRequest,
  type CreateMessageEvent,
  type DeleteChatRequest,
  EVENT_CONSTANTS,
  type GetChatsRequest,
  type GetMessagesRequest,
} from '@readytomog/contracts';
import type { Request } from 'express';
import { RmqService } from 'src/infrastructure/rmq/consumer/rmq.service';
import { WebsocketService } from 'src/infrastructure/websocket/websocket.service';
import { CacheInterseptor } from 'src/shared/interseptors/cache.interseptor';

import { ChatGrpcClient } from './chat.grpc';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatClient: ChatGrpcClient,
    private readonly websocketService: WebsocketService,
    private readonly rmqService: RmqService,
  ) {}

  @Post('create')
  public async createChat(@Req() req: Request, @Body() dto: CreateChatRequest) {
    return await this.chatClient.call('createChat', { participant: dto.participant }, req.metadata);
  }

  @Delete(':chatId')
  public async deleteChat(@Req() req: Request, @Param() dto: DeleteChatRequest) {
    return await this.chatClient.call('deleteChat', { chatId: dto.chatId }, req.metadata);
  }

  @UseInterceptors(CacheInterseptor)
  @Get(':userId')
  public async getChatsList(@Req() req: Request, @Param() dto: GetChatsRequest) {
    return await this.chatClient.call('getChats', { userId: dto.userId }, req.metadata);
  }

  @Get(':chatId/messages')
  public async getChatMessages(@Req() req: Request, @Param() dto: GetMessagesRequest) {
    return await this.chatClient.call('getMessages', { chatId: dto.chatId }, req.metadata);
  }

  @EventPattern(EVENT_CONSTANTS.messageCreated)
  public async createMessage(@Payload() data: CreateMessageEvent, @Ctx() ctx: RmqContext) {
    try {
      await this.websocketService.sendMessage(data);
      await this.rmqService.ack(ctx);
    } catch (error) {
      await this.rmqService.nack(ctx);
    }
  }
}
