import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findUserById(userId: string) {
    return await this.prismaService.user.findFirst({
      where: { id: userId },
    });
  }

  public async findUserByStripeCustomerId(stripeCustomerId: string) {
    return await this.prismaService.user.findFirst({
      where: { stripeCustomerId },
    });
  }

  public async updateUser(userId: string, data: Partial<User>) {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }

  public async createUser(data: User) {
    return await this.prismaService.user.create({
      data,
    });
  }
}
