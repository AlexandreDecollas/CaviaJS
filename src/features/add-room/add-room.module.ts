import { Module } from '@nestjs/common';
import { AddRoomService } from './service/add-room.service';
import { AddRoomController } from './controller/add-room.controller';

@Module({
  imports: [],
  providers: [AddRoomService],
  controllers: [AddRoomController],
})
export class AddRoomModule {}
