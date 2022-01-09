import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventstoreEvent } from '../../model/eventstoreEvent';
import { ESDBConnectionService } from '../eventstore-connector/connection-initializer/esdb-connection.service';
import { jsonEvent } from '@eventstore/db-client';
import { Client } from '@eventstore/db-client/dist/Client';

@Injectable()
export class Eventbus {
  constructor(
    private readonly connection: ESDBConnectionService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: Logger,
  ) {}

  public emit(streamName: string, event: EventstoreEvent): void {
    this.eventEmitter.emit(streamName, event);
  }

  @OnEvent('**')
  public async hookEvent(event: EventstoreEvent) {
    const client: Client = await this.connection.getConnectedClient();

    const formattedEvent = jsonEvent({
      type: event.type,
      data: event.data,
      metadata: {
        ...event.metadata,
        version: event.version ?? 1,
      },
    });
    this.logger.log('Event hooked: ', formattedEvent);

    await client.appendToStream(event.metadata.streamName, formattedEvent);
  }
}
