import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class VerifyTokenDto {
  @ApiProperty({
    example: '123456',
  })
  @MinLength(6)
  @IsString()
  token!: string;
}
