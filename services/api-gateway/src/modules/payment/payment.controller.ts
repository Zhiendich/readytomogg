import { Body, Controller, Get, Param, Patch, Post, Req, UseInterceptors } from '@nestjs/common';
import type {
  GetPlanByIdRequest,
  InitSubscriptionTransactionRequest,
  InitTransactionRequest,
  UpdateAutoRenewalStatusRequest,
} from '@readytomog/contracts';
import { type Request } from 'express';
import { CacheInterseptor } from 'src/shared/interseptors/cache.interseptor';

import { PaymentGrpcClient } from './payment.grpc';

@Controller('payment')
export class PaymentController {
  constructor(private readonly client: PaymentGrpcClient) {}

  @UseInterceptors(CacheInterseptor)
  @Get('history')
  public async getTransactionHistory(@Req() req: Request) {
    return await this.client.call('getHistory', {}, req.metadata);
  }

  @Post('init/subscription')
  public async initSubscriptionTransaction(
    @Req() req: Request,
    @Body() dto: InitSubscriptionTransactionRequest,
  ) {
    return await this.client.call('initSubscriptionTransaction', { ...dto }, req.metadata);
  }

  @Post('init/payment')
  public async initPaymentTransaction(@Req() req: Request, @Body() dto: InitTransactionRequest) {
    return await this.client.call('initTransaction', { ...dto }, req.metadata);
  }

  @Patch('autorenewal')
  public async updateAutoRenewalStatus(
    @Req() req: Request,
    @Body() dto: UpdateAutoRenewalStatusRequest,
  ) {
    return await this.client.call('updateAutoRenewalStatus', { ...dto }, req.metadata);
  }

  @UseInterceptors(CacheInterseptor)
  @Get('plan')
  public async getPlansList(@Req() req: Request) {
    return await this.client.call('getPlans', {}, req.metadata);
  }

  @UseInterceptors(CacheInterseptor)
  @Get('plan/:planId')
  public async getPlan(@Param() dto: GetPlanByIdRequest) {
    return await this.client.call('getPlans', { ...dto });
  }
}
