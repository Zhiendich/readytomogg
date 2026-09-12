import { Module } from '@nestjs/common';
import { GrpcModule } from '@readytomog/common';

import { AuthClientGrpc } from '../auth.grpc';

import { OtpController } from './otp.controller';

@Module({
  imports: [GrpcModule.register(['AUTH_PACKAGE'])],
  controllers: [OtpController],
  providers: [AuthClientGrpc],
})
export class OtpModule {}
