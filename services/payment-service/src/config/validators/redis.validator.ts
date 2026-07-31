import { IsInt, IsString, Max, Min } from 'class-validator';

export class RedisValidator {
  @IsString()
  public REDIS_HOST: string;

  @Min(1)
  @Max(65535)
  @IsInt()
  public REDIS_PORT: number;

  @IsString()
  public REDIS_PASSWORD: string;
}
