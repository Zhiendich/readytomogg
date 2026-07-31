import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { JwtDocument, JwtToken } from '../models/jwt.model';
import { Model } from 'mongoose';

@Injectable()
export class JwtRepository {
  constructor(
    @InjectModel(JwtToken.name)
    private readonly jwtTokenModel: Model<JwtDocument>,
  ) {}

  public async saveRefreshTokenToDb(refreshToken: string, userId: string) {
    await this.jwtTokenModel.updateOne(
      {
        userId,
      },
      {
        $set: {
          token: refreshToken,
        },
      },
      {
        upsert: true,
      },
    );
  }

  public async removeRefreshTokenFromDb(userId: string) {
    await this.jwtTokenModel
      .deleteOne({
        userId,
      })
      .exec();
  }
}
