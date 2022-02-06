import { Module } from '@nestjs/common';
import { PayementRequestedCommand } from './payement-requested.command';

@Module({
  controllers: [PayementRequestedCommand],
})
export class PayementRequestedModule {}
