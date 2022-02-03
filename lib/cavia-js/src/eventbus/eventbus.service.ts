import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ESDBConnectionService } from '../eventstore-connector';
import { jsonEvent } from '@eventstore/db-client';
import { Client } from '@eventstore/db-client/dist/Client';
import { INTERNAL_EVENTS_QUEUE_CONFIGURATION } from './constants';
import { RedisQueueConfiguration } from '../event-modelling.configuration';
import { Queue, Worker } from 'bullmq';
import { EventstoreEvent } from '../eventstore.event';

@Injectable()
export class Eventbus implements OnApplicationBootstrap {
  constructor(
    @Inject(INTERNAL_EVENTS_QUEUE_CONFIGURATION)
    private readonly internalEventsQueueConf: RedisQueueConfiguration,
    private readonly connection: ESDBConnectionService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: Logger,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    this.plugInternalEventQueue();
  }

  private plugInternalEventQueue(): void {
    if (!this.internalEventsQueueConf) {
      return;
    }
    new Worker(
      this.internalEventsQueueConf.queueName,
      async (event) => {
        this.logger.debug(
          'Event hooked on internal event queue : ' +
            JSON.stringify(event.data),
        );
        await this.appendToEventstore(event.data);
      },
      this.internalEventsQueueConf.options,
    );
  }

  public emit(streamName: string, event: EventstoreEvent): void {
    this.eventEmitter.emit(streamName, event);
  }

  @OnEvent('**')
  public async hookEvent(event: EventstoreEvent): Promise<void> {
    const formattedEvent = jsonEvent({
      type: event.type,
      data: event.data,
      metadata: {
        ...event.metadata,
        version: event.version ?? 1,
      },
    });

    if (this.internalEventsQueueConf) {
      await this.pushEventOnRedisQueue(formattedEvent);
    } else {
      await this.appendToEventstore(formattedEvent);
    }
  }

  private async pushEventOnRedisQueue(formattedEvent: any): Promise<void> {
    const messagesQueue = new Queue(
      this.internalEventsQueueConf.queueName,
      this.internalEventsQueueConf.options,
    );
    await messagesQueue.add(
      this.internalEventsQueueConf.queueName,
      formattedEvent,
      {
        removeOnComplete: true,
        removeOnFail: 1000,
      },
    );

    this.logger.debug(
      'Event queued on internal event queue: ' + JSON.stringify(formattedEvent),
    );
  }

  private async appendToEventstore(formattedEvent: any): Promise<void> {
    const client: Client = await this.connection.getConnectedClient();
    await client.appendToStream(
      formattedEvent.metadata.streamName,
      formattedEvent,
    );
    this.logger.debug(
      'Event appended on eventstore: ' + JSON.stringify(formattedEvent),
    );
  }
}
