import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@readytomog/common';
import { randomInt } from 'node:crypto';
import { UserRepository } from 'src/infrastructure/mongo/repositories/user.repository';

import { CacheService } from 'src/infrastructure/redis/redis.service';
import { ProducerService } from 'src/infrastructure/rmq/producer/producer.service';

@Injectable()
export class OtpService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_SECONDS = 300;
  constructor(
    private readonly cacheService: CacheService,
    private readonly producerService: ProducerService,
    private readonly userRepository: UserRepository,
  ) {}

  private async generateOtp(userId: string) {
    const otp = randomInt(100000, 1000000);
    await this.cacheService.set(
      `otp:${userId}`,
      otp,
      'EX',
      this.LOCKOUT_SECONDS,
    );

    return otp;
  }
  public async verifyOtp(otp: number, userId: string, identifire: string) {
    await this.checkLockout(userId);

    const otpRedis = await this.cacheService.get(`otp:${userId}`);

    if (!otpRedis || otp !== +otpRedis) {
      await this.registerFailedAttempt(userId);
    }

    if (identifire === 'email') {
      await this.userRepository.updateUser(userId, { isEmailVerified: true });

      await this.producerService.updateUser({
        id: userId,
        isEmailVerified: true,
      });
    } else {
      await this.userRepository.updateUser(userId, { isPhoneVerified: true });

      await this.producerService.updateUser({
        id: userId,
        isPhoneVerified: true,
      });
    }
    await this.resetAttempsCount(userId);

    return { verify: true };
  }
  public async sendOtp(userId: string, identifire: string) {
    const otp = await this.generateOtp(userId);

    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'User was not founded',
      });
    }

    if (identifire === 'email') {
      await this.producerService.sendOtpMail({
        otp,
        email: user.email,
      });
    } else {
      await this.producerService.sendOtpSms({
        otp,
        phone: user.phone,
      });
    }

    return { ok: true };
  }

  private async checkLockout(userId: string) {
    const key = `otp:lockout:${userId}`;
    const isLocked = await this.cacheService.get(key);

    if (isLocked) {
      throw new RpcException({
        code: RpcStatus.RESOURCE_EXHAUSTED,
        details: 'Too many failed attempts, try again later',
      });
    }
  }

  private async registerFailedAttempt(userId: string) {
    const key = `otp:attemps:${userId}`;
    const attemps = await this.cacheService.incr(key);
    await this.cacheService.expire(key, this.LOCKOUT_SECONDS);

    if (+attemps >= this.MAX_ATTEMPTS) {
      await this.cacheService.set(
        `otp:lockout:${userId}`,
        '1',
        'EX',
        this.LOCKOUT_SECONDS,
      );
    }

    throw new RpcException({
      code: RpcStatus.NOT_FOUND,
      details: 'Incorrect otp code',
    });
  }

  private async resetAttempsCount(userId: string) {
    const key = `otp:lockout:${userId}`;
    const attempsKey = `otp:attemps:${userId}`;
    await this.cacheService.del(key);
    await this.cacheService.del(attempsKey);
  }
}
