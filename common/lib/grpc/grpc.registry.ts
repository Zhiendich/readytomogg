import { PROTO_PATHS } from '@readytomog/contracts';

export const GRPC_CLIENTS = {
  AUTH_PACKAGE: {
    package: 'auth.v1',
    protoPath: PROTO_PATHS.AUTH,
    env: 'AUTH_GRPC_URL',
  },
  USER_PACKAGE: {
    package: 'user.v1',
    protoPath: PROTO_PATHS.USER,
    env: 'USER_GRPC_URL',
  },
  CHAT_PACKAGE: {
    package: 'chat.v1',
    protoPath: PROTO_PATHS.CHAT,
    env: 'CHAT_GRPC_URL',
  },
  PAYMENT_PACKAGE: {
    package: 'payment.v1',
    protoPath: PROTO_PATHS.PAYMENT,
    env: 'PAYMENT_GRPC_URL',
  },
} as const;
