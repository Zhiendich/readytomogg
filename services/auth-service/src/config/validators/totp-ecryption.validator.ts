import { IsString } from 'class-validator';

export class TotpEncryptionValidator {
  @IsString()
  public TOTP_ENCRYPTION_SECRET: string;
}
