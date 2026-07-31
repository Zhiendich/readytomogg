import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { BaseMapper } from '@readytomog/common';
import { GetChatsResponse } from '@readytomog/contracts';

import { ChatWithUsers } from './create-chat.mapper';

export interface ChatWithMessages extends ChatWithUsers {
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface ChatWithMessagesData {
  chats: ChatWithMessages[];
}

@Injectable()
export class GetChatsMapper extends BaseMapper<ChatWithMessagesData, GetChatsResponse> {
  toData(data: GetChatsResponse): ChatWithMessagesData {
    throw new Error('toData cannot be restored');
  }

  toDomain(data: ChatWithMessagesData): GetChatsResponse {
    return {
      chats: data.chats.map((chat) => ({
        id: chat.id,
        users: chat.users.map((u) => ({
          id: u.user.id,
          name: u.user.name,
          surname: u.user.surname,
          avatar: u.user.avatar ?? '',
        })),
        lastMessage: chat.messages[0]?.message ?? null,
        createdAt: chat.createdAt.toISOString(),
        updatedAt: chat.updatedAt.toISOString(),
      })),
    };
  }
}
