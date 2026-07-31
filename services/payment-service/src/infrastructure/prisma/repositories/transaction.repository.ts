import { Injectable } from '@nestjs/common';
import { Prisma, Transactions } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async getTransactionsList(userId: string) {
    return await this.prismaService.transactions.findMany({
      where: {
        userId,
      },
    });
  }

  public async findLastTransaction(userId: string) {
    return await this.prismaService.transactions.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async findTransactionById(id: string, include?: Prisma.TransactionsInclude) {
    return await this.prismaService.transactions.findFirst({
      where: {
        id,
      },
      include,
    });
  }

  public async createTransaction(data: Prisma.TransactionsUncheckedCreateInput) {
    return await this.prismaService.transactions.create({
      data: data,
    });
  }

  public async getTransactionByExternalId(externalId: string) {
    return await this.prismaService.transactions.findFirst({
      where: {
        externalId,
      },
    });
  }

  public async updateTransactionData(id: string, data: Partial<Transactions>) {
    return await this.prismaService.transactions.update({
      where: {
        id,
      },
      data,
    });
  }
}
