import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { InjectGrpcClient } from '@readytomog/common';
import type { AuthServiceClient } from '@readytomog/contracts';

import { AbstractGrpcClient } from '../../shared/grpc/abstract-grpc.client';

@Injectable()
export class AuthClientGrpc extends AbstractGrpcClient<AuthServiceClient> {
  constructor(@InjectGrpcClient('AUTH_PACKAGE') client: ClientGrpc) {
    super(client, 'AuthService');
  }
}
