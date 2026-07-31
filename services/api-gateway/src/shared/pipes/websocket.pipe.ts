import { ArgumentMetadata, Injectable, ValidationError, ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new WsException({
          message: `Validation failed`,
          errors: errors.map((error) => ({
            field: error.property,
            constraints: error.constraints,
          })),
        });
      },
    });
  }

  override async transform(value: unknown, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        throw new WsException('Invalid JSON');
      }
    }

    return super.transform(value, metadata);
  }
}
