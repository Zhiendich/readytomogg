import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import { BaseMapper } from '@readytomog/common';
import { GetPlansResponse } from '@readytomog/contracts';

export interface GetPlansData {
  plans: {
    id: string;
    title: string;
    description: string;
    monthlyPrice: Decimal;
    annualyPrice: Decimal;
  }[];
}

@Injectable()
export class GetPlansListMapper extends BaseMapper<GetPlansData, GetPlansResponse> {
  toData(data: GetPlansResponse): GetPlansData {
    return {
      plans: data.plans.map((plan) => ({
        ...plan,
        annualyPrice: Prisma.Decimal(plan.annualyPrice),
        monthlyPrice: Prisma.Decimal(plan.monthlyPrice),
      })),
    };
  }
  toDomain(data: GetPlansData): GetPlansResponse {
    return {
      plans: data.plans.map((plan) => ({
        ...plan,
        annualyPrice: +plan.annualyPrice,
        monthlyPrice: +plan.monthlyPrice,
      })),
    };
  }
}
