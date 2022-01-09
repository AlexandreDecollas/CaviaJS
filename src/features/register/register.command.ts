import { Get, Param } from '@nestjs/common';
import { Command } from '../../event-modelling-tooling/command/command.decorator';
import { RegisterLine } from './model/register-line';
import { Eventbus } from '../../event-modelling-tooling/eventbus/eventbus.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { RegisteredEvent } from '../../model/registered.event';

@Command({
  entryPoint: 'register',
})
export class RegisterCommand {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  @Get('/:clientName/:clientSurname')
  public register(
    @Param('clientName') clientName: string,
    @Param('clientSurname') clientSurname: string,
  ): void {
    const registerLine: RegisterLine = {
      clientName,
      clientSurname,
    };
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
