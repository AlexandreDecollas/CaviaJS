import { Module } from '@nestjs/common';
import { AddRoomService } from './service/add-room.service';
import { AddRoomController } from './controller/add-room.controller';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { EventbusModule } from '../../eventbus/eventbus.module';

@Module({
  imports: [EventbusModule],
  providers: [AddRoomService, IdGeneratorService],
  controllers: [AddRoomController],
})
export class AddRoomModule {}
