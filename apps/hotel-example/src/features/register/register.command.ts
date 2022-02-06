import { Get, Logger, Param } from '@nestjs/common';
import { RegisterLine } from './model/register-line';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { RegisteredEvent } from '../../model/registered.event';
import { Queue } from 'bullmq';
import { RegistrationRequestedEvent } from '../../model/registration-requested.event';
import { Command, Eventbus, ExternalEventHook } from 'cavia-js';
import { ApiParam } from '@nestjs/swagger';

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
  @ApiParam({ name: 'clientName', example: 'Rambo', type: String })
  @ApiParam({ name: 'clientSurname', example: 'John', type: String })
  public async register(
    @Param('clientName') clientName: string,
    @Param('clientSurname') clientSurname: string,
  ): Promise<void> {
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
    await this.eventEmitter.emit(event);
  }
}
