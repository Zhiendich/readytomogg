import { IsString } from 'class-validator';

export class SmsValidator {
  @IsString()
  public SMSCLUB_TOKEN: string;

  @IsString()
  SMSCLUB_SENDER: string;
}
