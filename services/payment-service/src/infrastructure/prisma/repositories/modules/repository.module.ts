import { Global, Module } from '@nestjs/common';


import { PlanRepository } from '../plan.repository';
import { ProviderRepository } from '../provider.repository';
import { SubscriptionRepository } from '../subscription.repository';
import { TransactionRepository } from '../transaction.repository';
import { UserRepository } from '../user.repository';

@Global()
@Module({
  providers: [
    TransactionRepository,
    PlanRepository,
    ProviderRepository,
    SubscriptionRepository,
    UserRepository,

  ],
  exports: [
    TransactionRepository,
    PlanRepository,
    ProviderRepository,
    SubscriptionRepository,
    UserRepository,
  ],
})
export class RepositoryModule {}
