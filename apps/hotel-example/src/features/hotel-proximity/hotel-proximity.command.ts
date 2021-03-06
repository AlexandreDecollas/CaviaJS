import { Get, Param } from '@nestjs/common';
import { GuestLeftEvent } from '../../model/guest-left.event';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { GuestEnteredEvent } from '../../model/guest-entered.event';
import { Command, Eventbus } from 'cavia-js';
import { ApiParam } from '@nestjs/swagger';

@Command({
  restOptions: { path: 'hotel-proximity' },
})
export class HotelProximityCommand {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  @Get('guest/left/:clientName')
  @ApiParam({ name: 'clientName', example: 'Rambo', type: String })
  public async guestLeft(
    @Param('clientName') clientName: string,
  ): Promise<void> {
    const event: GuestLeftEvent = new GuestLeftEvent(
      {
        guestName: clientName,
        id: this.idGeneratorService.generateId(),
      },
      {},
    );
    await this.eventEmitter.emit('gps.guest-left', event);
  }

  @Get('guest/entered/:clientName')
  @ApiParam({ name: 'clientName', example: 'Rambo', type: String })
  public async guestEntered(
    @Param('clientName') clientName: string,
  ): Promise<void> {
    const event: GuestEnteredEvent = new GuestEnteredEvent(
      {
        guestName: clientName,
        id: this.idGeneratorService.generateId(),
      },
      {},
    );
    await this.eventEmitter.emit('gps.guest-left', event);
  }
}
