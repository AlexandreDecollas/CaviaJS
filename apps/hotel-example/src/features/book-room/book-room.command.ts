import { Get, HttpException, Param } from '@nestjs/common';
import { BookRoomService } from './services/book-room/book-room.service';
import { buildRoomAvailabilityProjection } from './projections/room-availability.projections';
import { Slot } from './model/slot';
import {
  Command,
  PersubEventHook,
  providePersistentSubscription,
  provideProjection,
} from 'cavia-js';
import { ApiParam } from '@nestjs/swagger';

provideProjection({
  name: 'roomAvailability',
  content: buildRoomAvailabilityProjection(),
});

providePersistentSubscription({
  name: 'roomAvailabilityStateVersion',
  streamName: '$projections-roomAvailability',
  groupName: 'roomAvailability',
  settings: {
    minCheckpointCount: 1,
  },
});

@Command({
  restOptions: { path: 'book-room' },
  persubName: 'roomAvailabilityStateVersion',
})
export class BookRoomCommand {
  private stateUpdated = false;

  constructor(private readonly bookRoomService: BookRoomService) {}

  @Get('check-availability/:roomNumber')
  @ApiParam({ name: 'roomNumber', example: 123, type: Number })
  public async register(
    @Param('roomNumber') roomNumber: number,
  ): Promise<Slot[]> {
    try {
      return await this.bookRoomService.checkRoomAvailability(roomNumber);
    } catch (e) {
      throw new HttpException(e.message, 404);
    }
  }

  @Get('/:roomNumber/:from/:to')
  @ApiParam({ name: 'roomNumber', example: 123, type: Number })
  @ApiParam({ name: 'from', example: 'DD-MM-YYYY', type: String })
  @ApiParam({ name: 'to', example: 'DD-MM-YYYY', type: String })
  public async book(
    @Param('roomNumber') roomNumber: number,
    @Param('from') from: string,
    @Param('to') to: string,
  ): Promise<void> {
    await this.bookRoomService.bookRoom(
      {
        roomNumber,
        from,
        to,
      },
      this.stateUpdated,
    );
  }

  @PersubEventHook()
  public getLastStateVersion(): void {
    this.stateUpdated = true;
  }
}
