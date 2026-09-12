import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderItemRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async createOrderItem(data: Prisma.OrderItemUncheckedCreateInput) {
    return await this.prismaService.orderItem.create({
      data,
    });
  }
}
