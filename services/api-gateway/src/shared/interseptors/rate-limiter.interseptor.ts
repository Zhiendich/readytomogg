import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from, of, switchMap } from 'rxjs';
import { CacheService } from 'src/infrastructure/redis/redis.service';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rateLimitOff = this.reflector.get('rateLimitOff', context.getHandler());

    if (rateLimitOff) {
      next.handle();
      return;
    }
    const { route, method, ip } = context.switchToHttp().getRequest();

    const key = `rate_limit:${method}:${route.path}:${ip}`;

    const now = Date.now();
    const requestId = `${now}-${Math.random()}`;

    return from(this.cacheService.zremrangebyscore(key, 0, now - 10_000)).pipe(
      switchMap(() => from(this.cacheService.zcard(key))),

      switchMap((counter) => {
        if (counter > 5) {
          throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
        }

        return of(counter);
      }),

      switchMap(() => from(this.cacheService.zadd(key, now, requestId))),

      switchMap(() => from(this.cacheService.expire(key, 10))),

      switchMap(() => next.handle()),
    );
  }
}
