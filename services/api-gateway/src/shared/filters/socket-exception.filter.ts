import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException)
export class SocketExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client: Socket = host.switchToWs().getClient();
    client.emit('error', {
      message: exception.message,
    });
  }
}
