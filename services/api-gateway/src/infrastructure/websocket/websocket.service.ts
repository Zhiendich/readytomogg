import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateMessageEvent } from '@readytomog/contracts';
import { Server, Socket } from 'socket.io';

@Injectable()
export class WebsocketService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private server!: Server;

  public register(server: Server) {
    this.server = server;
  }

  public async sendMessage(data: CreateMessageEvent) {
    this.server.to(data.senderId).emit('newMessage', data);
    this.server.to(data.receiverId).emit('newMessage', data);
  }

  public async connetClient(client: Socket) {
    const token = client.handshake.headers.authorization;

    if (!token) {
      client.disconnect();
      return;
    }

    const payload = await this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });

    client.data.user = payload;
    await client.join(payload.id);
  }
}
