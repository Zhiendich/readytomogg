import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@readytomog/common';
import { SendMessageEvent } from '@readytomog/contracts';
import { ChatRepository } from 'src/infrastructure/prisma/repositories/chat.repository';
import { MessageRepository } from 'src/infrastructure/prisma/repositories/message.repository';
import { ProducerService } from 'src/infrastructure/rmq/producer/producer.service';

import { CreateChatMapper } from './mapper/create-chat.mapper';
import { GetChatsMapper } from './mapper/get-chats.mapper';
import { GetMessagesMapper } from './mapper/get-messages.mapper';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
    private readonly producerService: ProducerService,
    private readonly getChatsMapper: GetChatsMapper,
    private readonly getMessagesMapper: GetMessagesMapper,
    private readonly createChatMapper: CreateChatMapper,
  ) {}

  public async createChat(userId: string, patricipantId: string) {
    const chat = await this.chatRepository.createChat(userId, patricipantId);
    return this.createChatMapper.toDomain({ chat });
  }

  public async deleteChat(userId: string, chatId: string) {
    const user = await this.chatRepository.findChatUser(userId, chatId);
    if (!user) {
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        details: 'Forbidden',
      });
    }
    await this.chatRepository.deleteChat(chatId);

    return { message: 'Deleted successfully' };
  }

  public async getChatsList(userId: string, currentUserId: string) {
    if (userId !== currentUserId) {
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        details: 'Forbidden',
      });
    }
    const chats = await this.chatRepository.getChatsList(userId);
    return this.getChatsMapper.toDomain({ chats });
  }

  public async getChatMessages(userId: string, chatId: string) {
    const user = await this.chatRepository.findChatUser(userId, chatId);

    if (!user) {
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        details: 'Forbidden',
      });
    }
    const messages = await this.chatRepository.getChatMessages(chatId);

    return this.getMessagesMapper.toDomain({ messages });
  }

  public async sendMessage(data: SendMessageEvent) {
    const newMessage = await this.messageRepository.createMessage(data);
    this.producerService.messageCreated({ ...newMessage, receiverId: data.sendTo });
    return newMessage;
  }
}
