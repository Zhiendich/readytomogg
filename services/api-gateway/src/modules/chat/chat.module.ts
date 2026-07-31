import { Module } from '@nestjs/common';
import { GrpcModule } from '@readytomog/common';
import { WebsocketModule } from 'src/infrastructure/websocket/websocket.module';

import { ChatController } from './chat.controller';
import { ChatGrpcClient } from './chat.grpc';

@Module({
  imports: [GrpcModule.register(['CHAT_PACKAGE']), WebsocketModule],
  controllers: [ChatController],
  providers: [ChatGrpcClient],
})
export class ChatModule {}
