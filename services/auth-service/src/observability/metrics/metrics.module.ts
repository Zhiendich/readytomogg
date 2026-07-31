import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  PrometheusModule,
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
import { HttpMetricsInterceptor } from '../interseptors/http-metrics.interseptor';


@Global()
@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  providers: [
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP reuqest latency',
      labelNames: ['service', 'method', 'route', 'status'],
      buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 1, 1.5, 2, 3, 5],
    }),
    makeGaugeProvider({
      name: 'http_requests_in_flight',
      help: 'Current number pf in flight request',
      labelNames: ['service'],
    }),
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'HTTP requests count',
      labelNames: ['service', 'method', 'route', 'status'],
    }),
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpMetricsInterceptor,
    },
  ],
})
export class MetricsModule {}
