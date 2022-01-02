import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventstoreEvent } from '../model/eventstoreEvent';
import { ESDBConnectionService } from '../eventstore-connector/connection-initializer/esdb-connection.service';
import { jsonEvent } from '@eventstore/db-client';
import { Client } from '@eventstore/db-client/dist/Client';

@Injectable()
export class EventbusService {
  constructor(private readonly connection: ESDBConnectionService) {}

  @OnEvent('**')
  public async hookEvent(event: EventstoreEvent) {
    const client: Client = await this.connection.getConnectedClient();

    const formattedEvent = jsonEvent({
      type: event.type,
      data: event.data,
      metadata: event.metadata,
    });
    console.log('Event hooked: ', formattedEvent);

    await client.appendToStream(event.metadata.streamName, formattedEvent);
  }
}
