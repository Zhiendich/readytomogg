import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, from, of, switchMap, tap } from 'rxjs';
import { CacheService } from 'src/infrastructure/redis/redis.service';

@Injectable()
export class CacheInterseptor implements NestInterceptor {
  constructor(private readonly cacheService: CacheService) {}
  public async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, route, body, params } = request;

    let key = `${method}:${route.path}`;

    if (typeof params === 'object' && Object.keys(params).length) {
      key += `:${JSON.stringify(params)}`;
    }

    if (typeof body === 'object' && Object.keys(body).length) {
      key += `:${JSON.stringify(body)}`;
    }

    

    return from(this.cacheService.get(key)).pipe(
      switchMap((cached) => {
        if (cached) {
          return of(JSON.parse(cached));
        }

        return next.handle().pipe(
          tap((data) => {
            void this.cacheService.set(key, JSON.stringify(data), 'EX', 60 * 60 * 24);
          }),
        );
      }),
    );
  }
}
