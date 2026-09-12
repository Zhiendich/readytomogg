import { Roles } from "../../types";

export interface UpdateUserEvent {
  id: string;
  avatar?: string;
  email?: string;
  name?: string;
  surname?: string;
  roles?: Roles[];
  isOtpVerified?: boolean;
  isTwoFactorEnabled?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  customerId?: string;
  isAutoRenewal?: boolean;
  stripeCustomerId?: string;
}
