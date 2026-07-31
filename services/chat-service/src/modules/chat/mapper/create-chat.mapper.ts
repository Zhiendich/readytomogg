import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@readytomog/common';
import { CreateChatResponse } from '@readytomog/contracts';

export interface ChatUser {
  id: string;
  name: string;
  surname: string;
  avatar: string | null;
}

export interface ChatUserRelation {
  id: string;
  chatId: string;
  userId: string;
  user: ChatUser;
}

export interface ChatWithUsers {
  id: string;
  users: ChatUserRelation[];
}

export interface CreateChatData {
  chat: ChatWithUsers;
}

@Injectable()
export class CreateChatMapper extends BaseMapper<CreateChatData, CreateChatResponse> {
  toData(data: CreateChatResponse): CreateChatData {
    throw new Error('toData cannot be restored');
  }

  toDomain(data: CreateChatData): CreateChatResponse {
    return {
      id: data.chat.id,
      users: data.chat.users.map(({ user }) => ({
        avatar: user.avatar ?? '',
        ...user,
      })),
    };
  }
}
