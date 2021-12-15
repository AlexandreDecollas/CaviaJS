import { Injectable } from '@nestjs/common';
import { IdGeneratorService } from '../utils/id-generator/id-generator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RegisteredEvent } from '../model/registered.event';

@Injectable()
export class AppService {
  constructor(
    private readonly eventbusService: EventEmitter2,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public emitEvent(): void {
    const event: RegisteredEvent = {
      clientName: 'toto',
      clientSurname: 'tutu',
      id: this.idGeneratorService.generateId(),
    };
    this.eventbusService.emit('hotel.registered', event);
  }
}
