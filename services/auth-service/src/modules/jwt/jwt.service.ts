import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as JwtProvider } from '@nestjs/jwt';
import { JwtPayload } from '@readytomog/common';
import { JwtRepository } from 'src/infrastructure/mongo/repositories/jwt.repository';

@Injectable()
export class JwtService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtRepository: JwtRepository,
    private jwtService: JwtProvider,
  ) {}
  public async generateTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: '1d',
    });
    await this.jwtRepository.saveRefreshTokenToDb(refreshToken, payload.id);
    return { accessToken, refreshToken };
  }

  public async verifyAccessToken(token: string) {
    const payload: JwtPayload = this.jwtService.verify(token, {
      secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
    });

    return payload;
  }
  public async verifyRefreshToken(token: string) {
    const payload: JwtPayload = this.jwtService.verify(token, {
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
    });
    return payload;
  }
}
