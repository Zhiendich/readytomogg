import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { JwtPayload } from '@readytomog/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient();

    const token = client.handshake.headers.authorization;

    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(String(token), {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      client.data.user = payload;
    } catch (error) {
      throw new WsException('Unauthorized');
    }

    return true;
  }
}
