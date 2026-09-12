import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { type Request } from 'express';

import { AuthClientGrpc } from '../auth.grpc';

import { VerifyTokenDto } from './dto/verify-token.dto';

@Controller('2fa')
export class TwoFactorController {
  constructor(private readonly client: AuthClientGrpc) {}

  @ApiBearerAuth('access-token')
  @Get('generate')
  public async generateSecret(@Req() req: Request) {
    return await this.client.call('generateSecret', {}, req.metadata);
  }

  @ApiBearerAuth('access-token')
  @Post('verify')
  public async verifyToken(@Body() dto: VerifyTokenDto, @Req() req: Request) {
    return await this.client.call('verifyToken', { token: dto.token }, req.metadata);
  }

  @ApiBearerAuth('access-token')
  @Delete('disable')
  public async disableTwoFactor(@Req() req: Request) {
    return await this.client.call('disableTwoFactor', {}, req.metadata);
  }
}
