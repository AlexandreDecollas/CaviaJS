import { Module } from '@nestjs/common';
import { PayementProcessorCommand } from './payement-processor.command';

@Module({
  controllers: [PayementProcessorCommand],
})
export class PayementProcessorModule {}
