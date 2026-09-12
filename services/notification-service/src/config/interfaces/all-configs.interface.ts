import { RmqConfig } from './rmq.interface';
import { SmsConfig } from './sms.interface';
import { SMTPConfig } from './smtp.interface';

export interface AllConfigs {
  rmq: RmqConfig;
  smtp: SMTPConfig;
  sms: SmsConfig;
}
