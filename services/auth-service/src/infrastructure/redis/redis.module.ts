import { Global, Module } from '@nestjs/common';
import { CacheService } from './redis.service';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class RedisModule {}
