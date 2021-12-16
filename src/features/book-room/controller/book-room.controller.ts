import { Controller, Get, Param } from '@nestjs/common';
import { FreeSlot } from '../model/free-slot';
import { BookRoomService } from '../services/book-room/book-room.service';

@Controller('book-room')
export class BookRoomController {
  constructor(private readonly bookRoomService: BookRoomService) {}

  @Get('room-availability/:roomNumber')
  public async register(
    @Param('roomNumber') roomNumber: number,
  ): Promise<FreeSlot[]> {
    return this.bookRoomService.checkRoomAvailability(roomNumber);
  }

  @Get('book-room/:roomNumber/:from/:to')
  public book(
    @Param('roomNumber') roomNumber: number,
    @Param('from') from: string,
    @Param('to') to: string,
  ): void {
    this.bookRoomService.bookRoom(roomNumber, from, to);
  }
}
