import { IsString, Matches } from 'class-validator';

export class GrpcValidator {
  @IsString()
  @Matches(/^.+:([1-9]\d{0,4})$/, {
    message: 'AUTH_GRPC_URL must be in format "host:port"',
  })
  public AUTH_GRPC_URL: string;
  @IsString()
  @Matches(/^.+:([1-9]\d{0,4})$/, {
    message: 'AUTH_GRPC_URL must be in format "host:port"',
  })
  public USER_GRPC_URL: string;

  @IsString()
  @Matches(/^.+:([1-9]\d{0,4})$/, {
    message: 'CHAT_GRPC_URL must be in format "host:port"',
  })
  public CHAT_GRPC_URL: string;

  @IsString()
  @Matches(/^.+:([1-9]\d{0,4})$/, {
    message: 'CHAT_GRPC_URL must be in format "host:port"',
  })
  public PAYMENT_GRPC_URL: string;
}
