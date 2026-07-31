import { Body, Controller, Post, Req } from '@nestjs/common';
import { type SendOtpRequest, type VerifyOtpRequest } from '@readytomog/contracts';
import type { Request } from 'express';

import { AuthClientGrpc } from '../auth.grpc';

@Controller('otp')
export class OtpController {
  constructor(private readonly client: AuthClientGrpc) {}

  @Post('send')
  public async sendOtp(@Req() req: Request, @Body() data: SendOtpRequest) {
    return await this.client.call('sendOtp', { ...data }, req.metadata);
  }

  @Post('verify')
  public async verifyOtp(@Req() req: Request, @Body() data: VerifyOtpRequest) {
    return await this.client.call('verifyOtp', { ...data }, req.metadata);
  }
}
