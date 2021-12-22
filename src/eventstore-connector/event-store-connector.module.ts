import { Module } from '@nestjs/common';
import { ConnectionInitializerService } from './connection-initializer/connection-initializer.service';
import { ProjectionUpserterService } from './projection-upserter/projection-upserter.service';

@Module({
  providers: [ConnectionInitializerService, ProjectionUpserterService],
  exports: [ConnectionInitializerService, ProjectionUpserterService],
})
export class EventStoreConnectorModule {}
