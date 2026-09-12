import { IsString } from 'class-validator';

export class HttpValidator {
  @IsString()
  public AUTH_HTTP_URL: string;
  @IsString()
  public CHAT_HTTP_URL: string;
  @IsString()
  public USER_HTTP_URL: string;
  @IsString()
  public PAYMENT_HTTP_URL: string;
}
