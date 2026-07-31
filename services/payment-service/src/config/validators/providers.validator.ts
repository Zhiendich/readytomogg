import { IsString } from 'class-validator';

export class ProvidersValidator {
  @IsString()
  public LIGPAY_PUBLIC_KEY: string;

  @IsString()
  public LIQPAY_PRIVATE_KEY: string;

  @IsString()
  public LIQPAY_SERVER_URL: string;

  @IsString()
  public STRIPE_SECRET_KEY: string;

  @IsString()
  public STRIPE_WEBHOOK_SECRET: string;
}
