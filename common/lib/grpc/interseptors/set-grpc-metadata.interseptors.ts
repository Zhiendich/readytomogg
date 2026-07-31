import { Metadata } from '@grpc/grpc-js';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { JwtPayload } from '../../types';
import { extractMetadata } from '../../utils';

export interface GrpcMetadata extends Metadata {
  user?: JwtPayload;
}

@Injectable()
export class SetGrpcMetadata implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType() !== 'rpc') {
      return next.handle();
    }

    const rpc = context.switchToRpc();
    const ctx = rpc.getContext();

    if (!(ctx instanceof Metadata)) {
      return next.handle();
    }
    const metadata = ctx as GrpcMetadata;

    metadata.user = extractMetadata(ctx);

    return next.handle();
  }
}
