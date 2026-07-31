import { type ClientGrpc } from '@nestjs/microservices';
import { InjectGrpcClient } from '@readytomog/common';
import { PaymentServiceClient } from '@readytomog/contracts';
import { AbstractGrpcClient } from 'src/shared/grpc/abstract-grpc.client';

export class PaymentGrpcClient extends AbstractGrpcClient<PaymentServiceClient> {
  constructor(@InjectGrpcClient('PAYMENT_PACKAGE') client: ClientGrpc) {
    super(client, 'PaymentService');
  }
}
