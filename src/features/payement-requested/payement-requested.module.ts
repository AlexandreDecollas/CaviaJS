import { Command } from '../../event-modelling-tooling/command/command.decorator';
import { Get, Param } from '@nestjs/common';
import { Eventbus } from '../../event-modelling-tooling/eventbus/eventbus.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { PayementRequestedEvent } from '../../model/payement-requested.event';

@Command({
  entryPoint: 'payement-requested',
})
export class PayementRequestedModule {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  @Get('/:clientName')
  public async register(@Param('clientName') clientName: string) {
    const event: PayementRequestedEvent = {
      data: {
        id: this.idGeneratorService.generateId(),
        clientName,
      },
      metadata: { streamName: 'guest.request-payement' },
      type: 'PayementRequestedEvent',
    };
    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}
