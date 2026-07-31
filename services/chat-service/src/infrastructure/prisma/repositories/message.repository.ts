import { Injectable } from '@nestjs/common';
import type { SendMessageEvent } from '@readytomog/contracts';

import { PrismaService } from '../prisma.service';

@Injectable()
export class MessageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async createMessage(data: SendMessageEvent) {
    const { chatId, message, sendFrom, sendTo } = data;
    return await this.prismaService.message.create({
      data: {
        message,
        chatId,
        senderId: sendFrom,
      },
    });
  }
}
