import { Module } from '@nestjs/common';
import { CaviaJsService } from './cavia-js.service';

@Module({
  providers: [CaviaJsService],
  exports: [CaviaJsService],
})
export class CaviaJsModule {}
