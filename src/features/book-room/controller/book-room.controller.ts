import { Controller, Get, Param } from '@nestjs/common';
import { Slot } from '../model/slot';
import { BookRoomService } from '../services/book-room/book-room.service';

@Controller('book-room')
export class BookRoomController {
  constructor(private readonly bookRoomService: BookRoomService) {}

  @Get('check-availability/:roomNumber')
  public async register(
    @Param('roomNumber') roomNumber: number,
  ): Promise<Slot[]> {
    return this.bookRoomService.checkRoomAvailability(roomNumber);
  }

  @Get('/:roomNumber/:from/:to')
  public async book(
    @Param('roomNumber') roomNumber: number,
    @Param('from') from: string,
    @Param('to') to: string,
  ): Promise<void> {
    await this.bookRoomService.bookRoom(roomNumber, from, to);
  }
}
