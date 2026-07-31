import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async updateUser(id: string, data: Partial<User>) {
    return await this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  public async findUserById(id: string) {
    return await this.prismaService.user.findFirst({
      where: { id },
    });
  }

  public async findUserByEmail(email: string) {
    return await this.prismaService.user.findFirst({
      where: { email },
    });
  }

  public async createUser(data: Pick<User, 'id' | 'email' | 'name' | 'password' | 'surname'>) {
    return await this.prismaService.user.create({ data });
  }
}
