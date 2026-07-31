import { Global, Module } from '@nestjs/common';
import { JwtRepository } from '../jwt.repository';
import { OtpSecretRepository } from '../otp-secret.repository';
import { UserRepository } from '../user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtToken, JwtTokenSchema } from '../../models/jwt.model';
import { User, UserSchema } from '../../models/user.model';
import { OtpSecret, OtpSecretSchema } from '../../models/otp-secret.repository';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JwtToken.name, schema: JwtTokenSchema },
      { name: User.name, schema: UserSchema },
      { name: OtpSecret.name, schema: OtpSecretSchema },
    ]),
  ],
  providers: [JwtRepository, OtpSecretRepository, UserRepository],
  exports: [JwtRepository, OtpSecretRepository, UserRepository],
})
export class RepositoryModule {}
