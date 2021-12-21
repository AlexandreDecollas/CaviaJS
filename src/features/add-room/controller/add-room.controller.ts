import { Controller, Get, Param } from '@nestjs/common';
import { AddRoomService } from '../service/add-room.service';

@Controller('ad-room')
export class AddRoomController {
  constructor(private readonly addRoomService: AddRoomService) {}

  @Get('/:roomNumber/:occupiedFromDate/:occupiedToDate')
  public register(
    @Param('roomNumber') roomNumber: number,
    @Param('occupiedFromDate') occupiedFromDate: string,
    @Param('occupiedUntilDate') occupiedUntilDate: string,
  ): void {
    this.addRoomService.registerClient(
      roomNumber,
      occupiedFromDate,
      occupiedUntilDate,
    );
  }
}
