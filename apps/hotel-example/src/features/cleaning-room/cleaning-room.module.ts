import { Module } from '@nestjs/common';
import { CleaningRoomCommand } from './cleaning-room.command';

@Module({
  controllers: [CleaningRoomCommand],
})
export class CleaningRoomModule {}
