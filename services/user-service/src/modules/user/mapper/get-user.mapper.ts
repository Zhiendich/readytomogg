import { Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';
import {
  BaseMapper,
  mapGrpcRolesToRoles,
  mapRolesToGrpcRoles,
  validateEnumValues,
} from '@readytomog/common';
import { Roles as ContractRoles, type GetUserByIdResponse } from '@readytomog/contracts';

export interface GetUserData {
  name: string;
  id: string;
  email: string;
  surname: string;
  phone: string;
  isTwoFactorEnabled: boolean;
  isOtpVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  roles: Roles[];
}

@Injectable()
export class GetUserMapper extends BaseMapper<GetUserData, GetUserByIdResponse> {
  toData(data: GetUserByIdResponse): GetUserData {
    return {
      ...data,
      id: data.userId,
      roles: mapGrpcRolesToRoles(data.roles),
    };
  }

  toDomain(data: GetUserData): GetUserByIdResponse {
    const roles = validateEnumValues(ContractRoles, data.roles);
    return {
      ...data,
      userId: data.id,
      roles: mapRolesToGrpcRoles(roles),
    };
  }
}
