import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async createUser(data: Omit<User, 'avatar'>) {
    const { name, surname, id } = data;
    await this.prismaService.user.create({
      data: { name, surname, id },
    });
  }

  public async updateUser(id: string, data: Partial<User>) {
    const { name, avatar, surname } = data;
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        name,
        avatar,
        surname,
      },
    });
  }
}
