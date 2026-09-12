import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CurrentGrpcUser, type JwtPayload, SetGrpcMetadata } from '@readytomog/common';
import type {
  SendOtpRequest,
  SendOtpRespose,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@readytomog/contracts';

import { OtpService } from './otp.service';

@UseInterceptors(SetGrpcMetadata)
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @GrpcMethod('AuthService', 'SendOtp')
  public async sendOtp(
    @Payload() payload: SendOtpRequest,
    @CurrentGrpcUser() user: JwtPayload,
  ): Promise<SendOtpRespose> {
    return await this.otpService.sendOtp(user.id, payload.identifier);
  }
  @GrpcMethod('AuthService', 'VerifyOtp')
  public async verifyOtp(
    @Payload() payload: VerifyOtpRequest,
    @CurrentGrpcUser() user: JwtPayload,
  ): Promise<VerifyOtpResponse> {
    return await this.otpService.verifyOtp(payload.otp, user.id, payload.identifier);
  }
}
