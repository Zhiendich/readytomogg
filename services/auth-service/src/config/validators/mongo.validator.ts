import { IsString } from 'class-validator';

export class MongoValidator {
  @IsString()
  public MONGODB_URI: string;
}
