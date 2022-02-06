import { Module } from '@nestjs/common';
import { BookRoomCommand } from './book-room.command';
import { BookRoomService } from './services/book-room/book-room.service';

@Module({
  controllers: [BookRoomCommand],
  providers: [BookRoomService],
})
export class BookRoomModule {}
