import type { ClientGrpc } from '@nestjs/microservices';
import { InjectGrpcClient } from '@readytomog/common';
import { ChatServiceClient } from '@readytomog/contracts';
import { AbstractGrpcClient } from 'src/shared/grpc/abstract-grpc.client';

export class ChatGrpcClient extends AbstractGrpcClient<ChatServiceClient> {
  constructor(@InjectGrpcClient('CHAT_PACKAGE') client: ClientGrpc) {
    super(client, 'ChatService');
  }
}
