import { Global, Module } from '@nestjs/common';

import { ChatRepository } from '../chat.repository';
import { MessageRepository } from '../message.repository';
import { UserRepository } from '../user.repository';

@Global()
@Module({
  providers: [ChatRepository, UserRepository, MessageRepository],
  exports: [ChatRepository, UserRepository, MessageRepository],
})
export class RepositoryModule {}
