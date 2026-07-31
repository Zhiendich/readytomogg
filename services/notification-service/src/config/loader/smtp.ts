import type { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import type { AllConfigs } from '../interfaces';

export function getMailerConfig(configService: ConfigService<AllConfigs>): MailerOptions {
  return {
    transport: {
      host: configService.getOrThrow<string>('smtp.host', {
        infer: true,
      }),
      port: configService.getOrThrow<string>('smtp.port', {
        infer: true,
      }),
      auth: {
        user: configService.getOrThrow<string>('smtp.username', {
          infer: true,
        }),
        pass: configService.getOrThrow<string>('smtp.password', {
          infer: true,
        }),
      },
      // secure: configService.getOrThrow<string>('smtp.secure', {
      //   infer: true,
      // }),
      secure: false,
    },
    defaults: {
      from: `ReadyToMog ${configService.getOrThrow<string>('smtp.fromAddress', {
        infer: true,
      })}`,
    },
  };
}
