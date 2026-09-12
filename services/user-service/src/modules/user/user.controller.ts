import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, GrpcMethod, Payload, RmqContext } from '@nestjs/microservices';
import {
  type CreateUserEvent,
  EVENT_CONSTANTS,
  type GetUserByIdRequst,
  type GetUserByIdResponse,
  type UpdateUserEvent,
} from '@readytomog/contracts';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { RmqService } from 'src/infrastructure/rmq/consumer/rmq.service';

import { GetUserMapper } from './mapper/get-user.mapper';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rmqService: RmqService,
    private readonly userRepository: UserRepository,
    private readonly getUserMapper: GetUserMapper,
  ) {}

  @GrpcMethod('UserService', 'GetUserById')
  public async getUserById(data: GetUserByIdRequst): Promise<GetUserByIdResponse> {
    const user = await this.userService.getUser(data.userId);

    return this.getUserMapper.toDomain(user);
  }

  @EventPattern(EVENT_CONSTANTS.createUser)
  public async createUser(@Payload() payload: CreateUserEvent, @Ctx() ctx: RmqContext) {
    try {
      await this.userRepository.createUser({
        ...payload,
      });
      await this.rmqService.ack(ctx);
    } catch (error) {
      console.log('ERROR: ', error);
      await this.rmqService.nack(ctx);
    }
  }

  @EventPattern(EVENT_CONSTANTS.updateUser)
  public async updateUser(@Payload() payload: UpdateUserEvent, @Ctx() ctx: RmqContext) {
    try {
      const { id, ...data } = payload;
      await this.userRepository.updateUser(id, data);
      await this.rmqService.ack(ctx);
    } catch (error) {
      console.log('ERROR: ', error);
      await this.rmqService.nack(ctx);
    }
  }

  @EventPattern(EVENT_CONSTANTS.change2FA)
  public async updateTwoFactorStatus(@Payload() payload: UpdateUserEvent, @Ctx() ctx: RmqContext) {
    try {
      const { id, ...data } = payload;
      await this.userRepository.updateUser(id, data);
      await this.rmqService.ack(ctx);
    } catch (error) {
      console.log('ERROR: ', error);
      await this.rmqService.nack(ctx);
    }
  }
}
