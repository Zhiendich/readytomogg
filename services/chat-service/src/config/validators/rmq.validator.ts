import { IsString } from 'class-validator';

export class RmqValidator {
  @IsString()
  public RABBITMQ_URL: string;

  @IsString()
  public RABBITMQ_QUEUE: string;

  @IsString()
  public RABBITMQ_CLIENT_QUEUE: string;
}
