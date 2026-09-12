import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const traceExporter = new OTLPTraceExporter({
  url: process.env.JAEGER_URL,
});

const opSdk = new NodeSDK({
  traceExporter,
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'api-gateway',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-grpc': { enabled: true },
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-nestjs-core': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-redis': { enabled: true },
    }),
  ],
});

// maybe await
opSdk.start();
