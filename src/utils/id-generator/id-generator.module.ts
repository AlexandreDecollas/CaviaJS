import { Global, Module } from '@nestjs/common';
import { IdGeneratorService } from './id-generator.service';

@Global()
@Module({
  providers: [IdGeneratorService],
  exports: [IdGeneratorService],
})
export class IdGeneratorModule {}
