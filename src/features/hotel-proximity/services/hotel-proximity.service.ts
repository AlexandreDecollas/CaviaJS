import { Injectable } from '@nestjs/common';
import { GuestLeftEvent } from '../../../model/guest-left.event';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { GuestEnteredEvent } from '../../../model/guest-entered.event';
import { Eventbus } from '../../../eventbus/eventbus.service';

@Injectable()
export class HotelProximityService {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  public guestLeftHotel(clientName: string): void {
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

  public guestEnteredHotel(clientName: string): void {
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
