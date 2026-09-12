import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '@readytomog/common';
import type { Request } from 'express';

import { buildUserMetadata } from '../utils';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic || request.path === '/metrics') {
      return true;
    }

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      });

      request.user = payload;
      request.metadata = buildUserMetadata(payload);
    } catch (e) {
      throw new UnauthorizedException(e);
    }

    return true;
  }
}
