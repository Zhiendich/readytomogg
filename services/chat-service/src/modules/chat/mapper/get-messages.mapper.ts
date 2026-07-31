import { Message } from '@prisma/client';
import { BaseMapper } from '@readytomog/common';
import { GetMessagesResponse } from '@readytomog/contracts';

export interface GetMessagesData {
  messages: Message[];
}

export class GetMessagesMapper extends BaseMapper<GetMessagesData, GetMessagesResponse> {
  toData(data: GetMessagesResponse): GetMessagesData {
    return {
      messages: data.messages.map((message) => ({
        ...message,
        createdAt: new Date(message.createdAt),
        updatedAt: new Date(message.updatedAt),
      })),
    };
  }
  toDomain(data: GetMessagesData): GetMessagesResponse {
    return {
      messages: data.messages.map((message) => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString(),
      })),
    };
  }
}
