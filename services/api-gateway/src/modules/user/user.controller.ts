import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterseptor } from 'src/shared/interseptors/cache.interseptor';

import { GetUserDto } from './dto/get-user.dto';
import { UserClientGrpc } from './user.grpc';

@Controller('user')
export class UserController {
  constructor(private readonly client: UserClientGrpc) {}

  @UseInterceptors(CacheInterseptor)
  @Get('/:userId')
  public async getUserById(@Param() data: GetUserDto) {
    return await this.client.call('getUserById', { userId: data.userId });
  }
}
