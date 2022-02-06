import { Module } from '@nestjs/common';
import { AddRoomCommand } from './add-room.command';

@Module({
  controllers: [AddRoomCommand],
})
export class AddRoomModule {}
