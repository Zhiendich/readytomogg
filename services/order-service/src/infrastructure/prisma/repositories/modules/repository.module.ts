import { Global, Module } from '@nestjs/common';

import { OrderItemRepository } from '../order-item.repository';
import { OrderRepository } from '../order.repository';
import { ProductRepository } from '../product.repository';

@Global()
@Module({
  providers: [ProductRepository, OrderRepository, OrderItemRepository],
  exports: [ProductRepository, OrderRepository, OrderItemRepository],
})
export class RepositoryModule {}
