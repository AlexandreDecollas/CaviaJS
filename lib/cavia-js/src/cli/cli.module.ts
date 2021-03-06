import { Global, Module } from '@nestjs/common';
import { CliService } from './services/cli.service';
import { DiscoveryService } from '@nestjs/core';

@Global()
@Module({
  providers: [CliService, DiscoveryService],
  exports: [CliService],
})
export class CliModule {}
