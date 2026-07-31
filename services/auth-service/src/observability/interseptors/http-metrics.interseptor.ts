import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import type { Request, Response } from 'express';
import { Counter, Gauge, Histogram } from 'prom-client';
import { Observable, finalize } from 'rxjs';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  private readonly SERVICE_NAME: string;
  constructor(
    @InjectMetric('http_requests_total') private readonly counter: Counter<string>,
    @InjectMetric('http_request_duration_seconds') private readonly histogram: Histogram<string>,
    @InjectMetric('http_requests_in_flight') private readonly gauge: Gauge<string>,
  ) {
    this.SERVICE_NAME = 'api-gateway';
  }
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const { method, route } = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    this.gauge.inc({ service: this.SERVICE_NAME });

    const endTimer = this.histogram.startTimer();

    return next.handle().pipe(
      finalize(() => {
        const status = response.statusCode.toString();

        this.counter.inc({
          service: this.SERVICE_NAME,
          method,
          route,
          status,
        });

        endTimer({
          service: this.SERVICE_NAME,
          method,
          route,
          status,
        });

        this.gauge.dec({ service: this.SERVICE_NAME });
      }),
    );
  }
}
