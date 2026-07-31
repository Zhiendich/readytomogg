import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  public message: string;

  @IsString()
  public sendFrom: string;

  @IsString()
  public sendTo: string;

  @IsString()
  public chatId: string;
}
