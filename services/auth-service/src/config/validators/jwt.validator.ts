import { IsString } from 'class-validator';

export class JwtValidator {
  @IsString()
  public JWT_ACCESS_SECRET: string;

  @IsString()
  public JWT_REFRESH_SECRET: string;
}
