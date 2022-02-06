import { Module } from '@nestjs/common';
import { CheckOutCommand } from './check-out.command';

@Module({
  controllers: [CheckOutCommand],
})
export class CheckOutModule {}
