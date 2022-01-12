import { Get, Param } from '@nestjs/common';
import { BookRoomService } from './services/book-room/book-room.service';
import { provideProjection } from '../../event-modelling-tooling/eventstore-connector/projections/provider/projection.provider';
import { buildRoomAvailabilityProjection } from './projections/room-availability.projections';
import { Command } from '../../event-modelling-tooling/command/class-decorators/command.decorator';
import { Slot } from './model/slot';

provideProjection({
  name: 'roomAvailability',
  content: buildRoomAvailabilityProjection(),
});

@Command({
  entryPoints: { restPath: 'book-room' },
  providers: [BookRoomService],
})
export class BookRoomCommand {
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
