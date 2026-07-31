import { Injectable } from '@nestjs/common';
import { generateURI, generateSecret, verifySync } from 'otplib';

import QRCode from 'qrcode';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@readytomog/common';
import { decryptSecret, encryptSecret } from 'src/utils/encrypt';
import { CacheService } from 'src/infrastructure/redis/redis.service';

import { ProducerService } from 'src/infrastructure/rmq/producer/producer.service';
import { UserRepository } from 'src/infrastructure/mongo/repositories/user.repository';
import { OtpSecretRepository } from 'src/infrastructure/mongo/repositories/otp-secret.repository';

@Injectable()
export class TwoFactorService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_SECONDS = 300;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpSecretRepository: OtpSecretRepository,
    private readonly cacheService: CacheService,
    private readonly producerService: ProducerService,
  ) {}

  public async generateSecret(userId: string) {
    await this.deleteToken(userId);
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'User was not founded',
      });
    }

    const secret = generateSecret();
    const otpUrl = generateURI({
      label: user.email,
      secret,
      issuer: 'ReadyToMog',
    });

    const encryptedSecret = encryptSecret(secret);

    await this.otpSecretRepository.createOtpSecret(userId, encryptedSecret);

    return await this.generateQRCode(otpUrl);
  }
  public async verifyToken(token: string, userId: string) {
    await this.checkLockout(userId);

    const otpSecret = await this.otpSecretRepository.findOtpSecret(userId);

    if (!otpSecret) {
      await this.registerFailedAttempt(userId);
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Secret was not founded',
      });
    }

    const decryptedSecret = decryptSecret(otpSecret.secret);
    const isEqual = verifySync({
      token,
      secret: decryptedSecret,
    });

    if (!isEqual.valid)
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        details: 'Forbidden',
      });

    await this.userRepository.updateUser(userId, { isOtpVerified: true });

    await this.enableTwoFactor(userId);

    await this.resetAttempts(userId);

    await this.producerService.sendTwoFactorStatus({
      id: userId,
      isTwoFactorEnabled: true,
      isOtpVerified: true,
    });

    return { verify: true };
  }

  public async generateQRCode(otpUrl: string) {
    return { qrCode: await QRCode.toDataURL(otpUrl) };
  }

  private async deleteToken(userId: string) {
    await this.otpSecretRepository.deleteOtpSecret(userId);
  }

  private async enableTwoFactor(userId: string) {
    await this.userRepository.updateUser(userId, { isTwoFactorEnabled: true });
  }

  public async disableTwoFactor(userId: string) {
    await this.userRepository.updateUser(userId, {
      isTwoFactorEnabled: false,
      isOtpVerified: false,
    });

    await this.deleteToken(userId);

    await this.producerService.sendTwoFactorStatus({
      id: userId,
      isTwoFactorEnabled: false,
      isOtpVerified: false,
    });
    return { disable: true };
  }

  private async checkLockout(userId: string) {
    const key = `2fa:lockout:${userId}`;
    const isLocked = await this.cacheService.get(key);
    if (isLocked) {
      throw new RpcException({
        code: RpcStatus.RESOURCE_EXHAUSTED,
        details: 'Too many failed attempts, try again later',
      });
    }
  }
  private async registerFailedAttempt(userId: string) {
    const attemptsKey = `2fa:attempts:${userId}`;
    const attempsCount = await this.cacheService.incr(attemptsKey);
    await this.cacheService.expire(attemptsKey, this.LOCKOUT_SECONDS);

    if (+attempsCount >= this.MAX_ATTEMPTS) {
      const key = `2fa:lockout:${userId}`;
      await this.cacheService.set(key, '1', 'EX', this.LOCKOUT_SECONDS);
    }
  }
  private async resetAttempts(userId: string) {
    await this.cacheService.del(`2fa:attempts:${userId}`);
    await this.cacheService.del(`2fa:lockout:${userId}`);
  }
}
