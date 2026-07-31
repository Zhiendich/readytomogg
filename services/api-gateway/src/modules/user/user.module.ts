import { Module } from '@nestjs/common';
import { GrpcModule } from '@readytomog/common';

import { UserController } from './user.controller';
import { UserClientGrpc } from './user.grpc';

@Module({
  imports: [GrpcModule.register(['USER_PACKAGE'])],
  controllers: [UserController],
  providers: [UserClientGrpc],
})
export class UserModule {}
