import { Controller, Get, Param } from '@nestjs/common';
import { CleaningService } from '../services/cleaning.service';

@Controller('cleaning')
export class CleaningController {
  constructor(private readonly cleaningService: CleaningService) {}

  @Get('schedule')
  public async register() {
    return this.cleaningService.getSchedule();
  }

  @Get('ready-room/:roomNumber')
  public async readyRoom(@Param('roomNumber') roomNumber: number) {
    return this.cleaningService.readyRoom(roomNumber);
  }
}
