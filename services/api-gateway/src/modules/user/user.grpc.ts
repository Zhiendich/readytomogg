import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { InjectGrpcClient } from '@readytomog/common';
import type { UserServiceClient } from '@readytomog/contracts';

import { AbstractGrpcClient } from '../../shared/grpc/abstract-grpc.client';

@Injectable()
export class UserClientGrpc extends AbstractGrpcClient<UserServiceClient> {
  constructor(@InjectGrpcClient('USER_PACKAGE') client: ClientGrpc) {
    super(client, 'UserService');
  }
}
