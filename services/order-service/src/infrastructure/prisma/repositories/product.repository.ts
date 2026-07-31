import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async getProductsByIds(ids: string[]) {
    return await this.prismaService.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  public async createProducts(products: Prisma.ProductUncheckedCreateInput[]) {
    for (const product of products) {
      const exist = await this.prismaService.product.findFirst({
        where: {
          title: product.title,
        },
      });

      if (!exist) {
        await this.prismaService.product.create({
          data: product,
        });
      }
    }
  }
}
