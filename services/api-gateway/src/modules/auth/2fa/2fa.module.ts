import { Module } from '@nestjs/common';
import { GrpcModule } from '@readytomog/common';

import { AuthClientGrpc } from '../auth.grpc';

import { TwoFactorController } from './2fa.controller';

@Module({
  imports: [GrpcModule.register(['AUTH_PACKAGE'])],
  controllers: [TwoFactorController],
  providers: [AuthClientGrpc],
})
export class TwoFactorModule {}
