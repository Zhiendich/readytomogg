import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'test@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
  })
  @MinLength(6)
  @IsString()
  password!: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: '1',
  })
  accessToken!: string;
}
