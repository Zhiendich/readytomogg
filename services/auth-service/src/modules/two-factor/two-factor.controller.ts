import { Controller, UseInterceptors } from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import {
  CurrentGrpcUser,
  SetGrpcMetadata,
  type JwtPayload,
} from '@readytomog/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
  DisableTwoFactorResponse,
  VerifyTokenResponse,
  type VerifyTokenRequest,
} from '@readytomog/contracts';

@UseInterceptors(SetGrpcMetadata)
@Controller('two-factor')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @GrpcMethod('AuthService', 'GenerateSecret')
  public async generateSecret(@CurrentGrpcUser() user: JwtPayload) {
    return await this.twoFactorService.generateSecret(user.id);
  }
  @GrpcMethod('AuthService', 'VerifyToken')
  public async verifyToken(
    @Payload() payload: VerifyTokenRequest,
    @CurrentGrpcUser() user: JwtPayload,
  ): Promise<VerifyTokenResponse> {
    return await this.twoFactorService.verifyToken(payload.token, user.id);
  }
  @GrpcMethod('AuthService', 'DisableTwoFactor')
  public async disableTwoFactor(
    @CurrentGrpcUser() user: JwtPayload,
  ): Promise<DisableTwoFactorResponse> {
    return await this.twoFactorService.disableTwoFactor(user.id);
  }
}
