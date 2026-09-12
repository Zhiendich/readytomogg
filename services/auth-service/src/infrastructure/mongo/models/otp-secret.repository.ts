import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

export type OtpSecretDocument = HydratedDocument<OtpSecret>;

@Schema({ timestamps: true })
export class OtpSecret {
  @Prop({
    type: String,
    default: () => randomUUID(),
  })
  _id: string;

  @Prop({
    unique: true,
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  secret: string;
}

export const OtpSecretSchema = SchemaFactory.createForClass(OtpSecret);
