import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '@readytomog/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow('JWT_ACCESS_SECRET'),
    });
  }
  validate(payload: JwtPayload) {
    return { id: payload.id, roles: payload.roles };
  }
}
