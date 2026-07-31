import { Global, Module } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AllConfigs } from 'src/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService<AllConfigs>) => ({
        uri: config.get('mongo.mongo_url', { infer: true }),
        retryWrites: true,
        retryReads: true,
        serverSelectionTimeoutMS: 5000,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MongoService],
})
export class MongoModule {}
