import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

import { GrpcMetricsInterceptor } from '../interseptors/grpc-metrics.interseptor';

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
      name: 'grpc_request_duration_seconds',
      help: 'gRPC reuqest latency',
      labelNames: ['service', 'method'],
    }),
    makeCounterProvider({
      name: 'grpc_requests_total',
      help: 'Total GRPC requests',
      labelNames: ['service', 'method', 'status'],
    }),
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcMetricsInterceptor,
    },
  ],
})
export class MetricsModule {}
