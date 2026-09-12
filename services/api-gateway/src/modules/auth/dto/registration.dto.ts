import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegistrationDto {
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

  @ApiProperty({
    example: 'Denis',
  })
  @MinLength(2)
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Dudin',
  })
  @MinLength(2)
  @IsString()
  surname!: string;
}

export class RegistrationResponseDto {
  @ApiProperty({
    example: 'User created',
  })
  message!: string;
}
