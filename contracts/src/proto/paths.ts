import { join } from "path";

export const PROTO_PATHS = {
  AUTH: join(__dirname, "../../proto/auth.proto"),
  USER: join(__dirname, "../../proto/user.proto"),
  CHAT: join(__dirname, "../../proto/chat.proto"),
  PAYMENT: join(__dirname, "../../proto/payment.proto"),
} as const;
