import { Global, Module } from '@nestjs/common';
import { CliService } from './cli.service';

@Global()
@Module({
  providers: [CliService],
  exports: [CliService],
})
export class CliModule {}
