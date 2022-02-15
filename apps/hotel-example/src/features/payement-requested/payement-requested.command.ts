import { Get, Param } from '@nestjs/common';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { PayementRequestedEvent } from '../../model/payement-requested.event';
import { Command, Eventbus } from 'cavia-js';
import { ApiParam } from '@nestjs/swagger';

@Command({
  restOptions: { path: 'payement-requested' },
})
export class PayementRequestedCommand {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  @Get('/:clientName')
  @ApiParam({ name: 'clientName', example: 'Rambo', type: String })
  public async register(@Param('clientName') clientName: string) {
    const event: PayementRequestedEvent = new PayementRequestedEvent(
      {
        id: this.idGeneratorService.generateId(),
        clientName,
      },
      { streamName: 'guest.request-payement' },
    );
    await this.eventEmitter.emit(event);
  }
}
