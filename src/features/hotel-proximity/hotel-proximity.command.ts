import { Get, Param } from '@nestjs/common';
import { Command } from '../../event-modelling-tooling/command/command.decorator';
import { GuestLeftEvent } from '../../model/guest-left.event';
import { Eventbus } from '../../event-modelling-tooling/eventbus/eventbus.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { GuestEnteredEvent } from '../../model/guest-entered.event';

@Command({
  entryPoint: { restPath: 'hotel-proximity' },
})
export class HotelProximityCommand {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  @Get('guest/left/:clientName')
  public async guestLeft(
    @Param('clientName') clientName: string,
  ): Promise<void> {
    const event: GuestLeftEvent = {
      data: {
        guestName: clientName,
        id: this.idGeneratorService.generateId(),
      },
      metadata: { streamName: 'gps.guest-left' },
      type: 'GuestLeftEvent',
    };
    this.eventEmitter.emit(event.metadata.streamName, event);
  }

  @Get('guest/entered/:clientName')
  public async guestEntered(
    @Param('clientName') clientName: string,
  ): Promise<void> {
    const event: GuestEnteredEvent = {
      data: {
        guestName: clientName,
        id: this.idGeneratorService.generateId(),
      },
      metadata: { streamName: 'gps.guest-left' },
      type: 'GuestEnteredEvent',
    };
    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}
