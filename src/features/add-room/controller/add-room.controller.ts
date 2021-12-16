import { Controller, Get, Param } from '@nestjs/common';
import { AddRoomService } from '../service/add-room.service';

@Controller('ad-room')
export class AddRoomController {
  constructor(private readonly addRoomService: AddRoomService) {}

  @Get('/:roomNumber/:freeFromDate/:freeToDate')
  public register(
    @Param('roomNumber') roomNumber: number,
    @Param('freeFromDate') freeFromDate: string,
    @Param('freeToDate') freeToDate: string,
  ): void {
    this.addRoomService.registerClient(roomNumber, freeFromDate, freeToDate);
  }
}
