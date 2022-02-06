import { Module } from '@nestjs/common';
import { CheckInCommand } from './check-in.command';
import { CheckInService } from './services/check-in.service';

@Module({
  controllers: [CheckInCommand],
  providers: [CheckInService],
})
export class CheckInModule {}
