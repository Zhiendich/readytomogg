import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async createOrder(data: Prisma.OrderUncheckedCreateInput) {
    return await this.prismaService.order.create({
      data,
    });
  }
}
