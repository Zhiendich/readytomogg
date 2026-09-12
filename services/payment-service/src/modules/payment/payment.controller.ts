import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CurrentGrpcUser, type JwtPayload, SetGrpcMetadata } from '@readytomog/common';
import {
  type GetHistoryResponse,
  InitTransactionResponse,
  type UpdateAutoRenewalStatusRequest,
  UpdateAutoRenewalStatusResponse,
} from '@readytomog/contracts';
import { InitSubscriptionTransactionPipe } from 'src/shared';

import { GetTransactionHistoryMapper } from './mappers/get-transaction-history.mapper';
import { PaymentService } from './payment.service';
import type { InitSubscriptionTransactionType, InitTransactionType } from './payment.type';
import { SubscriptionService } from './subscription/subscription.service';

@UseInterceptors(SetGrpcMetadata)
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly subscriptionService: SubscriptionService,
    private readonly getTransactionHistoryMapper: GetTransactionHistoryMapper,
  ) {}

  @GrpcMethod('PaymentService', 'GetHistory')
  public async getTransactionHistory(
    @CurrentGrpcUser() user: JwtPayload,
  ): Promise<GetHistoryResponse> {
    const transactions = await this.paymentService.getTransactionHistory(user.id);

    return this.getTransactionHistoryMapper.toDomain({ transactions });
  }

  @GrpcMethod('PaymentService', 'InitSubscriptionTransaction')
  public async initSubscriptionTransaction(
    @Payload(new InitSubscriptionTransactionPipe()) payload: InitSubscriptionTransactionType,
    @CurrentGrpcUser() user: JwtPayload,
  ): Promise<InitTransactionResponse> {
    return await this.subscriptionService.initSubscriptionTransaction(payload, user.id);
  }

  @GrpcMethod('PaymentService', 'InitTransaction')
  public async initTransaction(
    @Payload() payload: InitTransactionType,
    @CurrentGrpcUser() user: JwtPayload,
  ) {
    return await this.paymentService.initTransaction(payload, user.id);
  }

  @GrpcMethod('PaymentService', 'UpdateAutoRenewalStatus')
  public async updateAutoRenewalStatus(
    @Payload() payload: UpdateAutoRenewalStatusRequest,
    @CurrentGrpcUser() user: JwtPayload,
  ): Promise<UpdateAutoRenewalStatusResponse> {
    return await this.subscriptionService.updateAutoRenewal(user.id, payload.isAutoRenewal);
  }
}
