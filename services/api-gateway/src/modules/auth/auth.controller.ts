import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Public } from 'src/shared/decorators/public.decorator';

import { AuthClientGrpc } from './auth.grpc';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegistrationDto, RegistrationResponseDto } from './dto/registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly client: AuthClientGrpc) {}

  @ApiResponse({
    status: 200,
    description: 'User logged in',
    type: LoginResponseDto,
  })
  @Public()
  @Post('login')
  public async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.client.call('login', dto);

    res.cookie('refreshToken', refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.json({ accessToken });
  }

  @ApiResponse({
    status: 201,
    description: 'User created',
    type: RegistrationResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('registration')
  public registration(@Body() dto: RegistrationDto) {
    return this.client.call('registration', dto);
  }

  @ApiBearerAuth('access-token')
  @Post('logout')
  public async logout(@Req() req: Request, @Res() res: Response) {
    const { ok } = await this.client.call('logout', {}, req.metadata);
    if (ok) {
      res.clearCookie('refreshToken').json({ message: 'Logout successfully' });
    }
  }

  @ApiBearerAuth('access-token')
  @Post('refresh')
  public async refreshAuth(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken: newRefreshToken } = await this.client.call(
      'refreshAuth',
      {},
      req.metadata,
    );

    res.cookie('refreshToken', newRefreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.json({ accessToken });
  }
}
