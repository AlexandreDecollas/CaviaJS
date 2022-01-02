import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventstoreEvent } from '../model/eventstoreEvent';
import { ESDBConnectionService } from '../eventstore-connector/connection-initializer/esdb-connection.service';
import { jsonEvent } from '@eventstore/db-client';
import { Client } from '@eventstore/db-client/dist/Client';
import { FIFO } from './constants';
import { EventsFifo } from './in-memory-fifo/events.fifo';

@Injectable()
export class Eventbus {
  constructor(
    @Inject(FIFO) private readonly eventsFifo: EventsFifo<EventstoreEvent>,
    private readonly connection: ESDBConnectionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public emit(streamName: string, event: EventstoreEvent): void {
    this.eventEmitter.emit(streamName, event);
  }

  @OnEvent('**')
  public async hookEvent(event: EventstoreEvent) {
    this.eventsFifo.add(event);
    await this.tryToDeQueue();
  }

  private async tryToDeQueue(): Promise<void> {
    while (!this.eventsFifo.isEmpty()) {
      const client: Client = await this.connection.getConnectedClient();

      const firstEvent: EventstoreEvent = await this.eventsFifo.getFirst();
      const formattedEvent = jsonEvent({
        type: firstEvent.type,
        data: firstEvent.data,
        metadata: {
          ...firstEvent.metadata,
          version: firstEvent.version ?? 1,
        },
      });

      await client.appendToStream(
        firstEvent.metadata.streamName,
        formattedEvent,
      );
      this.eventsFifo.pop();
    }
  }
}
