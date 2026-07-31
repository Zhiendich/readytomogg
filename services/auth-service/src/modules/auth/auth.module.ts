import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  controllers: [AuthController],
  imports: [JwtModule],
  providers: [AuthService],
})
export class AuthModule {}
