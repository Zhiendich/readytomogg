import { IsString } from 'class-validator';

export class RmqValidator {
  @IsString()
  public RABBITMQ_URL: string;
}
