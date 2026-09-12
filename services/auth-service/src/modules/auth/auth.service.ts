import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtPayload, RpcStatus, validateEnumValues } from '@readytomog/common';
import { LoginRequest, RegistrationRequest, Roles } from '@readytomog/contracts';
import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';
import { JwtRepository } from 'src/infrastructure/mongo/repositories/jwt.repository';
import { UserRepository } from 'src/infrastructure/mongo/repositories/user.repository';
import { ProducerService } from 'src/infrastructure/rmq/producer/producer.service';

import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtRepository: JwtRepository,
    private readonly jwtService: JwtService,
    private readonly producerService: ProducerService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }
  public async login(dto: LoginRequest) {
    const { email, password } = dto;
    const findUser = await this.userRepository.findUserByEmail(email);
    if (!findUser)
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'User was not founded',
      });
    const isEqual = bcrypt.compareSync(password, findUser.password);
    if (!isEqual)
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        details: 'Incorrect password',
      });

    this.logger.info({ user: findUser }, 'Login user');

    const payload: JwtPayload = {
      id: findUser.id,
      roles: validateEnumValues(Roles, findUser.roles),
    };

    return await this.jwtService.generateTokens(payload);
  }

  public async registration(dto: RegistrationRequest) {
    const { email, password, name, surname } = dto;
    const findUser = await this.userRepository.findUserByEmail(email);

    if (findUser)
      throw new RpcException({
        code: RpcStatus.ALREADY_EXISTS,
        details: 'User already exists',
      });

    const hashPassword = bcrypt.hashSync(password, 7);

    const newUser = await this.userRepository.createUser({
      email,
      name,
      surname,
      password: hashPassword,
    });

    const roles = validateEnumValues(Roles, newUser.roles);
    await this.producerService.createUser({
      ...newUser,
      roles,
    });
    return { message: 'User created' };
  }

  public async logout(dto: { userId: string }) {
    const { userId } = dto;
    await this.jwtRepository.removeRefreshTokenFromDb(userId);
    return { ok: true };
  }

  public async refreshAuth(dto: { userId: string }) {
    const { userId } = dto;

    const user = await this.userRepository.findUserById(userId);

    if (!user)
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'User was not founded',
      });

    await this.jwtRepository.removeRefreshTokenFromDb(userId);

    const payload = {
      id: user.id,
      roles: validateEnumValues(Roles, user.roles),
    };

    const { accessToken, refreshToken } = await this.jwtService.generateTokens(payload);

    await this.jwtRepository.saveRefreshTokenToDb(refreshToken, userId);

    return { accessToken, refreshToken };
  }
}
