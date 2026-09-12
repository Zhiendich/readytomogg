import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppContoller {
  @Get('')
  public pingHealthService() {
    return 'pong';
  }
}
