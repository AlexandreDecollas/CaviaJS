import { Get, Logger, Param } from '@nestjs/common';
import { Command } from '../../event-modelling-tooling/command-decorators/class-decorators/command.decorator';
import { Eventbus } from '../../event-modelling-tooling/eventbus/eventbus.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { ExternalEventHook } from '../../event-modelling-tooling/command-decorators/method-decorator/external-event-hook.decorator';
import { GrpcMethod } from '@nestjs/microservices';
import { StuffId } from './stuff';
import { StuffEvent } from './stuff.event.ts';

@Command({
  restOptions: { path: 'register' },
  externalEventQueue: {
    queueName: 'register-queue',
    options: { host: '127.0.0.1', port: 6379 },
  },
})
export class MultiEntrypointSampleCommand {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly logger: Logger,
  ) {}

  @ExternalEventHook
  public externalEventCallback(event: StuffEvent): void {
    this.logger.log(`Logger spotted stuff event of id ${event.data.id}`);
  }

  @Get('triggerExternalEvent')
  @GrpcMethod('StuffService', 'ApplyStuff')
  public applyStuff(@Param() stuffId: StuffId): void {
    const event: StuffEvent = {
      metadata: { streamName: 'testStream' },
      type: 'StuffEvent',
      data: {
        id: stuffId.id,
      },
    };
    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}
