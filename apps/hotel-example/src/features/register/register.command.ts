import { Get, Logger, Param } from '@nestjs/common';
import { RegisterLine } from './model/register-line';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { RegisteredEvent } from '../../model/registered.event';
import { Queue } from 'bullmq';
import { RegistrationRequestedEvent } from '../../model/registration-requested.event';
import {
  Command,
  Eventbus,
  ExternalEventHook,
  InternalQueueJobData,
} from 'cavia-js';
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
  public async externalEventCallback(
    event: RegistrationRequestedEvent,
  ): Promise<void> {
    this.logger.debug(`External event hooked : ${event}`);
    if (event.type !== 'RegistrationRequestedEvent') {
      // could be class-validation here
      throw Error(`The event is incorrect.`);
    }
    await this.register(event.data.clientName, event.data.clientSurname);
  }

  // Simulate an external event, only for the demo purpose
  @Get('triggerExternalEvent')
  async triggerExternalEvent(): Promise<void> {
    const q = new Queue<InternalQueueJobData<any, any, any>, void, string>(
      'register-queue',
      {
        connection: { host: 'localhost', port: 6379 },
      },
    );
    const event: RegistrationRequestedEvent = new RegistrationRequestedEvent(
      {
        clientName: 'DOE',
        clientSurname: 'JOHN',
        id: this.idGeneratorService.generateId(),
      },
      {},
    );

    const jobData: InternalQueueJobData<any, any, any> = {
      event,
      streamName: 'okokok',
    };

    await q.add('', jobData);
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
    const event: RegisteredEvent = new RegisteredEvent(
      {
        id: this.idGeneratorService.generateId(),
        clientName: registerLine.clientName,
        clientSurname: registerLine.clientSurname,
      },
      {},
    );
    await this.eventEmitter.emit('guest.registered', event);
  }
}
