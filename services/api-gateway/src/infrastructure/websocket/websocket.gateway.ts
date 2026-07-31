import { Logger, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketExceptionFilter } from 'src/shared/filters/socket-exception.filter';
import { WsJwtGuard } from 'src/shared/guards/ws-jwt.guard';
import { WsValidationPipe } from 'src/shared/pipes/websocket.pipe';

import { ProducerService } from '../rmq/producer/producer.service';

import { SendMessageDto } from './dto/send-message.dto';
import { WebsocketService } from './websocket.service';

@UseFilters(SocketExceptionFilter)
@UseGuards(WsJwtGuard)
@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly producerService: ProducerService,
    private readonly websocketService: WebsocketService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(AppGateway.name);

  @UsePipes(new WsValidationPipe())
  @SubscribeMessage('msgToServer')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() dto: SendMessageDto) {
    this.producerService.sendMessage({ ...dto, sendFrom: client.data.user.id });
  }

  async handleConnection(client: Socket, ...args: any[]) {
    await this.websocketService.connetClient(client);
  }

  afterInit(server: Server) {
    this.websocketService.register(this.server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
