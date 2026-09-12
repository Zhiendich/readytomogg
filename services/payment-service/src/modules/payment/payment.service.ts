import { Injectable } from '@nestjs/common';
import { PaymentProvider, Prisma } from '@prisma/client';
import { TransactionRepository } from 'src/infrastructure/prisma/repositories/transaction.repository';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';

import { InitTransactionType } from './payment.type';
import { LiqpayProvider } from './providers/liqpay.provider';
import { StripeProvider } from './providers/stripe.provider';

@Injectable()
export class PaymentService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly stripeProvider: StripeProvider,
    private readonly liqpayProvider: LiqpayProvider,
  ) {}
  public async getTransactionHistory(userId: string) {
    return await this.transactionRepository.getTransactionsList(userId);
  }

  // TODO finish
  public async initTransaction(dto: InitTransactionType, userId: string) {
    const { products, provider } = dto;
    const productIds = products.map((p) => p.product_id);

    // const productsInfo = await this.productRepository.getProductsByIds(productIds);

    // const orderItems = productsInfo.map((product, index) => ({
    //   id: product.id,
    //   price: +product.price,
    //   quantity: products[index].quantity,
    // }));

    // const total = orderItems.reduce((acc, product) => acc + product.price * product.quantity, 0);

    // const order = await this.orderRepository.createOrder({
    //   status: OrderStatus.pending,
    //   total,
    //   user: {
    //     connect: {
    //       id: userId,
    //     },
    //   },
    // });

    // for (const item of orderItems) {
    //   await this.orderItemRepository.createOrderItem({
    //     price: item.price,
    //     quantity: item.quantity,
    //     product: {
    //       connect: {
    //         id: item.id,
    //       },
    //     },
    //     order: {
    //       connect: {
    //         id: order.id,
    //       },
    //     },
    //   });
    // }

    // const transaction = await this.transactionRepository.createTransaction({
    //   amount: Prisma.Decimal(total),
    //   paymentProvider: provider,
    //   status: TransactionStatus.pending,
    //   transactionType: TransactionType.order,
    //   order: {
    //     connect: {
    //       id: order.id,
    //     },
    //   },
    //   user: {
    //     connect: {
    //       id: userId,
    //     },
    //   },
    //   externalId: null,
    // });

    let payment;

    switch (provider) {
      case PaymentProvider.stripe:
        // payment = await this.stripeProvider.createPayment({

        // });
        break;
      case PaymentProvider.liqpay:
        // payment = await this.liqpayProvider.createPayment({
        //   amount: total,
        //   currency: 'USD',
        //   description: 'Payment for goods',
        //   orderId: transaction.id,
        // });
        break;
    }
  }
}
