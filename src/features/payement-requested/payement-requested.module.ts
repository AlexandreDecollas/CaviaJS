import { Module } from '@nestjs/common';
import { PayementRequestedController } from './controllers/payement-requested.controller';
import { PayementRequestedService } from './services/payement-requested.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { EventStoreConnectorModule } from '../../eventstore-connector/event-store-connector.module';
import { EventbusModule } from '../../eventbus/eventbus.module';

@Module({
  controllers: [PayementRequestedController],
  imports: [EventStoreConnectorModule, EventbusModule],
  providers: [PayementRequestedService, IdGeneratorService],
})
export class PayementRequestedModule {}
