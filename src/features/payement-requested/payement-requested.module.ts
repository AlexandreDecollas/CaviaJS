import { Module } from '@nestjs/common';
import { PayementRequestedController } from './controllers/payement-requested.controller';
import { PayementRequestedService } from './services/payement-requested.service';

@Module({
  controllers: [PayementRequestedController],
  providers: [PayementRequestedService],
})
export class PayementRequestedModule {}
