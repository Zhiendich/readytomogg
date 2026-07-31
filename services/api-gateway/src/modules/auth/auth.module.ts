import { Module } from '@nestjs/common';
import { GrpcModule } from '@readytomog/common';

import { TwoFactorModule } from './2fa/2fa.module';
import { AuthController } from './auth.controller';
import { AuthClientGrpc } from './auth.grpc';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [GrpcModule.register(['AUTH_PACKAGE']), TwoFactorModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthClientGrpc],
})
export class AuthModule {}
