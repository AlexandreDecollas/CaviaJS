import { Module } from '@nestjs/common';
import { MultiEntrypointSampleCommand } from './multi-entrypoint-sample.command';

@Module({
  controllers: [MultiEntrypointSampleCommand],
})
export class MultiEntrypointSampleModule {}
