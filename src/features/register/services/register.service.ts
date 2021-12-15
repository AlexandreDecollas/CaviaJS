import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RegisterLine } from '../model/register-line';
import { RegisteredEvent } from '../../../model/registered-event';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly eventEmitter2: EventEmitter2,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  public registerClient(registerLine: RegisterLine): void {
    const event: RegisteredEvent = {
      id: this.idGeneratorService.generateId(),
      clientName: registerLine.clientName,
      clientSurname: registerLine.clientSurname,
    };
    this.eventEmitter2.emit('guest.registered', event);
  }
}
