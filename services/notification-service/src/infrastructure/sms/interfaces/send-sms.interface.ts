export interface SendSmsRequest {
  phone: string[];
  ['src_addr']: string;
  message: string;
}

export interface SendSmsResponse {
  success_request: {
    info: Record<string, string>;
  };
}
