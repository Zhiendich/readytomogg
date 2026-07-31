import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@readytomog/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  public async getUser(userId: string) {
    const { password, ...user } = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'User was not founded',
      });
    }

    return user;
  }
}
