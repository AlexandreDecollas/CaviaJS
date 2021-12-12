import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventHandlerService } from './event-handler/event-handler.service';
import { IdGeneratorService } from '../utils/id-generator/id-generator.service';

@Module({
  controllers: [AppController],
  providers: [AppService, EventHandlerService, IdGeneratorService],
})
export class EventEmitterExampleModule {}
