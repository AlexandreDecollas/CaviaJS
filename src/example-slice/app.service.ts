import { Injectable } from '@nestjs/common';
import { IdGeneratorService } from '../utils/id-generator/id-generator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RegisteredEvent } from '../model/registered.event';

@Injectable()
export class AppService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public emitEvent(): void {
    const event: RegisteredEvent = {
      type: 'RegisteredEvent',
      data: {
        id: this.idGeneratorService.generateId(),
        clientName: 'toto',
        clientSurname: 'tutu',
      },
      metadata: { streamName: 'hotel.registered' },
    };
    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}
