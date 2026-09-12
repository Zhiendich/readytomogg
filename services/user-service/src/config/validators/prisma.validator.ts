import { IsString } from 'class-validator';

export class PrismaValidator {
  @IsString()
  public DATABASE_USER: string;

  @IsString()
  public DATABASE_PASSWORD: string;

  @IsString()
  public DATABASE_NAME: string;
}
