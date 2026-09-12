import { Module } from '@nestjs/common';

import { AppGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  providers: [AppGateway, WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
