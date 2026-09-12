import { IsEmail, IsNumber, IsString } from 'class-validator';

export class SMTPValidator {
  @IsString()
  public RABBITMQ_URL: string;

  @IsString()
  public RMQ_QUEUE: string;

  @IsString()
  public SMTP_HOST: string;

  @IsNumber()
  public SMTP_PORT: number;

  @IsString()
  public SMTP_USERNAME: string;

  @IsString()
  public SMTP_PASSWORD: string;

  @IsEmail()
  public SMTP_FROM_ADDRESS: string;

  @IsString()
  public SMTP_SECURE: string;
}
