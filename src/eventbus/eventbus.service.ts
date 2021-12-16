import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventstoreEvent } from '../model/eventstoreEvent';
import { ConnectionInitializerService } from '../eventstore-connector/connection-initializer/connection-initializer.service';
import { jsonEvent } from '@eventstore/db-client';

@Injectable()
export class EventbusService {
  constructor(
    private readonly connectionInitializerService: ConnectionInitializerService,
  ) {}

  @OnEvent('**')
  public async hookEvent(event: EventstoreEvent) {
    const client = this.connectionInitializerService.getConnectedClient();

    const formattedEvent = jsonEvent({
      type: event.type,
      data: event.data,
      metadata: event.metadata,
    });
    console.log('Event hooked : ', formattedEvent);

    await client.appendToStream(event.metadata.streamName, formattedEvent);
  }
}
