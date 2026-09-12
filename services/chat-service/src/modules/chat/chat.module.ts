import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CreateChatMapper } from './mapper/create-chat.mapper';
import { GetChatsMapper } from './mapper/get-chats.mapper';
import { GetMessagesMapper } from './mapper/get-messages.mapper';

@Module({
  controllers: [ChatController],
  providers: [ChatService, GetChatsMapper, GetMessagesMapper, CreateChatMapper],
})
export class ChatModule {}
