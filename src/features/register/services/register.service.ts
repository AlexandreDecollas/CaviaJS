import { Injectable } from '@nestjs/common';
import { RegisterLine } from '../model/register-line';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { RegisteredEvent } from '../../../model/registered.event';
import { Eventbus } from '../../../event-modelling-tooling/eventbus/eventbus.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  public registerClient(registerLine: RegisterLine): void {
    const event: RegisteredEvent = {
      type: 'RegisteredEvent',
      data: {
        id: this.idGeneratorService.generateId(),
        clientName: registerLine.clientName,
        clientSurname: registerLine.clientSurname,
      },
      metadata: { streamName: 'guest.registered' },
    };
    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}
