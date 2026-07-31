import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async createChat(userId: string, patricipantId: string) {
    const chat = await this.prismaService.chat.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                userId,
              },
            },
          },
          {
            users: {
              some: {
                userId: patricipantId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (chat) {
      return chat;
    }

    return await this.prismaService.chat.create({
      data: {
        users: {
          create: [{ userId }, { userId: patricipantId }],
        },
      },
      select: {
        id: true,
        users: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  public async getChatsList(userId: string) {
    return await this.prismaService.chat.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  public async deleteChat(chatId: string) {
    return await this.prismaService.chat.deleteMany({
      where: {
        id: chatId,
      },
    });
  }

  public async getChatMessages(chatId: string) {
    return await this.prismaService.message.findMany({
      where: {
        chatId,
      },
    });
  }

  public async findChatUser(userId: string, chatId: string) {
    return await this.prismaService.chat.findFirst({
      where: {
        id: chatId,
        users: {
          some: {
            userId,
          },
        },
      },
    });
  }
}
