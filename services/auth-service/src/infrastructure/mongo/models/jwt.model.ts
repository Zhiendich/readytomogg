import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { randomUUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

export type JwtDocument = HydratedDocument<JwtToken>;

@Schema({ timestamps: true })
export class JwtToken {
  @Prop({
    type: String,
    default: () => randomUUID(),
  })
  _id: string;

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  token: string;
}

export const JwtTokenSchema = SchemaFactory.createForClass(JwtToken);
