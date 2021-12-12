import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RegisteredEvent } from '../model/registered-event';
import { IdGeneratorService } from '../utils/id-generator/id-generator.service';

@Injectable()
export class AppService {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public emitEvent(): void {
    const event: RegisteredEvent = {
      arrivalDate: new Date().toISOString(),
      clientName: 'toto',
      id: this.idGeneratorService.generateId(),
    };
    this.eventEmitter.emit('hotel.registered', event);
  }
}
