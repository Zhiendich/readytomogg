import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegistrationDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  @IsString()
  password!: string;

  @MinLength(2)
  @IsString()
  name!: string;

  @MinLength(2)
  @IsString()
  surname!: string;
}
