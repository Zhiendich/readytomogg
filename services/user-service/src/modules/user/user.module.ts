import { Module } from '@nestjs/common';

import { GetUserMapper } from './mapper/get-user.mapper';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, GetUserMapper],
})
export class UserModule {}
