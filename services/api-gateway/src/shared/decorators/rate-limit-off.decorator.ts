import { SetMetadata } from '@nestjs/common';

export const RateLimitOff = () => SetMetadata('rateLimitOff', true);
