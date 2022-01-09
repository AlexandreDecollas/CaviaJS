import { Module } from '@nestjs/common';
import { PayementRequestedController } from './controllers/payement-requested.controller';
import { PayementRequestedService } from './services/payement-requested.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';

@Module({
  controllers: [PayementRequestedController],
  providers: [PayementRequestedService, IdGeneratorService],
})
export class PayementRequestedModule {}
