import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.model';
import { Model } from 'mongoose';
import { formatMongoDocument } from 'src/utils';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModal: Model<UserDocument>,
  ) {}

  public async updateUser(id: string, data: Partial<User>) {
    return await this.userModal.updateOne(
      {
        id,
      },
      {
        ...data,
      },
    );
  }

  public async findUserById(id: string) {
    return await this.userModal.findById(id).exec();
  }

  public async findUserByEmail(email: string) {
    return await this.userModal
      .findOne({
        email,
      })
      .exec();
  }

  public async createUser(
    data: Pick<User, 'email' | 'name' | 'password' | 'surname'>,
  ) {
    const user = await this.userModal.create(data);

    return formatMongoDocument(user);
  }
}
