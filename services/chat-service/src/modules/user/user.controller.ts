import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { type CreateUserEvent, EVENT_CONSTANTS, type UpdateUserEvent } from '@readytomog/contracts';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { RmqService } from 'src/infrastructure/rmq/consumer/rmq.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern(EVENT_CONSTANTS.createUser)
  public async createUser(@Payload() payload: CreateUserEvent, @Ctx() ctx: RmqContext) {
    try {
      const { id, name, surname } = payload;
      await this.userRepository.createUser({
        id,
        name,
        surname,
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
      const { id, name, surname, avatar } = payload;
      await this.userRepository.updateUser(id, { name, surname, avatar });
      await this.rmqService.ack(ctx);
    } catch (error) {
      console.log('ERROR: ', error);
      await this.rmqService.nack(ctx);
    }
  }
}
