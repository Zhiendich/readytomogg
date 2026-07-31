import { IsInt, IsString } from 'class-validator';

export class PrismaValidator {
  @IsString()
  public DATABASE_HOST: string;

  @IsString()
  public DATABASE_USER: string;

  @IsString()
  public DATABASE_PASSWORD: string;

  @IsInt()
  public DATABASE_PORT: number;

  @IsString()
  public DATABASE_NAME: string;

  @IsString()
  public DATABASE_URL: string;
}
