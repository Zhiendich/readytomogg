import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from '@readytomog/contracts';
import { randomUUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({})
export class User {
  @Prop({
    type: String,
    default: () => randomUUID(),
  })
  _id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: true, default: false })
  isEmailVerified: boolean;

  @Prop({ required: true, default: false })
  isTwoFactorEnabled: boolean;

  @Prop({ required: true, default: false })
  isOtpVerified: boolean;

  @Prop({ required: true, default: false })
  isPhoneVerified: boolean;

  @Prop({ required: true, default: [Roles.user] })
  roles: Roles[];
}

export const UserSchema = SchemaFactory.createForClass(User);
