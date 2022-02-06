import { Get, Logger, Param } from '@nestjs/common';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { GrpcMethod } from '@nestjs/microservices';
import { StuffId } from './stuff';
import { StuffEvent } from './stuff.event.ts';
import { Command, Eventbus, ExternalEventHook } from 'cavia-js';
import { ApiBody } from '@nestjs/swagger';

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
  @ApiBody({ type: StuffId })
  public async applyStuff(@Param() stuffId: StuffId): Promise<void> {
    const event: StuffEvent = {
      metadata: { streamName: 'testStream' },
      type: 'StuffEvent',
      data: {
        id: stuffId.id,
      },
    };
    await this.eventEmitter.emit(event);
  }
}
