import { Get, Param } from '@nestjs/common';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { PayementRequestedEvent } from '../../model/payement-requested.event';
import { Command, Eventbus } from 'cavia-js';

@Command({
  restOptions: { path: 'payement-requested' },
})
export class PayementRequestedCommand {
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
    await this.eventEmitter.emit(event);
  }
}
