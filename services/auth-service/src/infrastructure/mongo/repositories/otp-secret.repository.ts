import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OtpSecret, OtpSecretDocument } from '../models/otp-secret.repository';
import { Model } from 'mongoose';
import { formatMongoDocument } from 'src/utils';

@Injectable()
export class OtpSecretRepository {
  constructor(
    @InjectModel(OtpSecret.name)
    private readonly otpSecretModel: Model<OtpSecretDocument>,
  ) {}

  public async deleteOtpSecret(userId: string) {
    await this.otpSecretModel.deleteOne({
      userId,
    });
  }

  public async createOtpSecret(userId: string, secret: string) {
    const otpSecret = await this.otpSecretModel.create({
      userId,
      secret,
    });
    return formatMongoDocument(otpSecret);
  }

  public async findOtpSecret(userId: string) {
    return await this.otpSecretModel
      .findOne({
        userId,
      })
      .exec();
  }
}
