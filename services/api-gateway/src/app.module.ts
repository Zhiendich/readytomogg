import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { grpcEnv, providersEnv, redisEnv, rmqEnv } from './config';
import { RedisModule } from './infrastructure/redis/redis.module';
import { RmqModule } from './infrastructure/rmq/consumer/rmq.module';
import { ProducerModule } from './infrastructure/rmq/producer/producer.module';
import { WebsocketModule } from './infrastructure/websocket/websocket.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { PaymentModule } from './modules/payment/payment.module';
import { UserModule } from './modules/user/user.module';
import { ObservabilityModule } from './observability/observability.module';
import { AuthJwtGuard } from './shared/guards/auth-jwt.guard';
import { RateLimiterInterceptor } from './shared/interseptors/rate-limiter.interseptor';
import { AccessJwtStrategy } from './shared/strategy/access-jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisEnv, grpcEnv, rmqEnv, providersEnv],
    }),
    ObservabilityModule,
    RmqModule,
    ProducerModule,
    RedisModule,
    PassportModule,
    JwtModule.register({
      global: true,
    }),
    WebsocketModule,
    AuthModule,
    UserModule,
    ChatModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AccessJwtStrategy,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthJwtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimiterInterceptor,
    },
  ],
})
export class AppModule {}
