import { Controller, Get, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigs } from 'src/config';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('health')
export class HealthcheckController {
  private logger = new Logger(HealthcheckController.name);
  constructor(private readonly configService: ConfigService<AllConfigs>) {}

  @Public()
  @Get('')
  public pingMe() {
    return {
      service: 'api-gateway',
      status: 'ok',
    };
  }

  @Public()
  @Get('auth')
  public async pingAuthService() {
    try {
      const serviceUrl = this.configService.get('http.auth_http_url', { infer: true });

      const url = `${serviceUrl}/health`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new InternalServerErrorException('Auth service is unhealthy');
      }

      return {
        service: 'auth',
        status: 'ok',
      };
    } catch (error) {
      this.logger.error({ error }, 'Ping Auth Service error');
    }
  }

  @Public()
  @Get('user')
  public async pingUserService() {
    try {
      const serviceUrl = this.configService.get('http.user_http_url', { infer: true });

      const url = `${serviceUrl}/health`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new InternalServerErrorException('User service is unhealthy');
      }

      return {
        service: 'user',
        status: 'ok',
      };
    } catch (error) {
      this.logger.error({ error }, 'Ping User Service error');
    }
  }

  @Public()
  @Get('chat')
  public async pingChatService() {
    try {
      const serviceUrl = this.configService.get('http.chat_http_url', { infer: true });

      const url = `${serviceUrl}/health`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new InternalServerErrorException('Chat service is unhealthy');
      }

      return {
        service: 'chat',
        status: 'ok',
      };
    } catch (error) {
      this.logger.error({ error }, 'Ping Chat Service error');
    }
  }

  @Public()
  @Get('payment')
  public async pingPaymentService() {
    try {
      const serviceUrl = this.configService.get('http.payment_http_url', { infer: true });

      const url = `${serviceUrl}/health`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new InternalServerErrorException('Payment service is unhealthy');
      }

      return {
        service: 'payment',
        status: 'ok',
      };
    } catch (error) {
      this.logger.error({ error }, 'Ping Payment Service error');
    }
  }
}
