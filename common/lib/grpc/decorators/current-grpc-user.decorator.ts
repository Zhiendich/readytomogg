import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentGrpcUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const rpc = ctx.switchToRpc();
  const metadata = rpc.getContext();
  return metadata.user;
});
