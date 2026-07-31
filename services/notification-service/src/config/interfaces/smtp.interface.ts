export interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  secure: string;
  fromAddress: string;
}
