import { Get, Logger, Param } from '@nestjs/common';
import { Command } from '../../event-modelling-tooling/command-decorators/class-decorators/command.decorator';
import { RegisterLine } from './model/register-line';
import { Eventbus } from '../../event-modelling-tooling/eventbus/eventbus.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { RegisteredEvent } from '../../model/registered.event';
import { Queue } from 'bullmq';
import { RegistrationRequestedEvent } from '../../model/registration-requested.event';
import { ExternalEventHook } from '../../event-modelling-tooling/command-decorators/method-decorator/external-event-hook.decorator';

@Command({
  restOptions: { path: 'register' },
  externalEventQueue: {
    queueName: 'register-queue',
    options: { host: '127.0.0.1', port: 6379 },
  },
})
export class RegisterCommand {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly logger: Logger,
  ) {}

  @ExternalEventHook
  public externalEventCallback(event: RegistrationRequestedEvent): void {
    this.logger.debug(`External event hooked : ${event}`);
    if (event.type !== 'RegistrationRequestedEvent') {
      // could be class-validation here
      throw Error(`The event is incorrect.`);
    }
    this.register(event.data.clientName, event.data.clientSurname);
  }

  // Simulate an external event, only for the demo purpose
  @Get('triggerExternalEvent')
  async triggerExternalEvent(): Promise<void> {
    const q = new Queue('register-queue', {
      connection: { host: 'localhost', port: 6379 },
    });
    const event: RegistrationRequestedEvent = {
      data: {
        clientName: 'DOE',
        clientSurname: 'JOHN',
        id: this.idGeneratorService.generateId(),
      },
      metadata: { streamName: 'okokok' },
      type: 'RegistrationRequestedEvent',
    };

    await q.add('', event);
  }

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
