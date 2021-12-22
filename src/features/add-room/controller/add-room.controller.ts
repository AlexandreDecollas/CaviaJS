import { Controller, Get, Param } from '@nestjs/common';
import { AddRoomService } from '../service/add-room.service';

@Controller('add-room')
export class AddRoomController {
  constructor(private readonly addRoomService: AddRoomService) {}

  @Get('/:roomNumber')
  public register(@Param('roomNumber') roomNumber: number): void {
    this.addRoomService.addRoom(roomNumber);
  }
}
