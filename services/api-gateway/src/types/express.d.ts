import { Metadata } from '@grpc/grpc-js';
import { JwtPayload } from '@readytomog/common';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      metadata: Metadata;
    }
  }
}

export {};
