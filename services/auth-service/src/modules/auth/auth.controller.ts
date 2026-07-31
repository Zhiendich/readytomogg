import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshAuthResponse,
  RegistrationRequest,
  RegistrationResponse,
} from '@readytomog/contracts';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';

import { CurrentGrpcUser, type JwtPayload } from '@readytomog/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  public async login(dto: LoginRequest): Promise<LoginResponse> {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    return { accessToken, refreshToken };
  }
  @GrpcMethod('AuthService', 'Registration')
  public async registration(
    dto: RegistrationRequest,
  ): Promise<RegistrationResponse> {
    return await this.authService.registration(dto);
  }
  @GrpcMethod('AuthService', 'Logout')
  public async logout(
    @CurrentGrpcUser() user: JwtPayload,
  ): Promise<LogoutResponse> {
    return await this.authService.logout({ userId: user.id });
  }
  @GrpcMethod('AuthService', 'RefreshAuth')
  public async refreshAuth(
    @CurrentGrpcUser() user: JwtPayload,
  ): Promise<RefreshAuthResponse> {
    return await this.authService.refreshAuth({ userId: user.id });
  }
}
