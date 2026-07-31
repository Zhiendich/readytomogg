import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getHello(): string {
    return 'Gateway work!';
  }
  public health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
