import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
  providers: [JwtService],
  imports: [
    NestJwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '300s' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtService],
})
export class JwtModule {}
