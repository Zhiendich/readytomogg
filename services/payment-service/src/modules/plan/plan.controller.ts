import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { SetGrpcMetadata } from '@readytomog/common';
import {
  type GetPlanByIdRequest,
  GetPlanByIdResponse,
  type GetPlansResponse,
} from '@readytomog/contracts';

import { PlanService } from './plan.service';

@UseInterceptors(SetGrpcMetadata)
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @GrpcMethod('PaymentService', 'GetPlans')
  public async getPlansList(): Promise<GetPlansResponse> {
    return await this.planService.getPlansList();
  }

  @GrpcMethod('PaymentService', 'GetPlanById')
  public async getPlanById(@Payload() payload: GetPlanByIdRequest): Promise<GetPlanByIdResponse> {
    return await this.planService.getPlanById(payload.planId);
  }
}
