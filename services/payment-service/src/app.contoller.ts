import { Controller, Get } from '@nestjs/common';

@Controller('ping')
export class AppContoller {
  @Get('')
  public pingHealthService() {
    return 'pong';
  }
}
