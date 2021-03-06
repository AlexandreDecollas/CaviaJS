import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ESDBConnectionService } from '../eventstore-connector';
import { jsonEvent } from '@eventstore/db-client';
import { Client } from '@eventstore/db-client/dist/Client';
import { INTERNAL_EVENTS_QUEUE_CONFIGURATION } from './constants';
import { RedisQueueConfiguration } from '../misc/event-modelling.configuration';
import { Job, Queue, Worker } from 'bullmq';
import { EventstoreEvent } from '../misc/eventstore.event';
import { InternalQueueJobData } from './internal-queue-job-data';

@Injectable()
export class Eventbus implements OnApplicationBootstrap {
  constructor(
    @Inject(INTERNAL_EVENTS_QUEUE_CONFIGURATION)
    private readonly internalEventsQueueConf: RedisQueueConfiguration,
    private readonly connection: ESDBConnectionService,
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
      async (
        job: Job<InternalQueueJobData<any, any, any>, void, string>,
      ): Promise<void> => {
        this.logger.debug(
          'Event hooked on internal event queue : ' +
            JSON.stringify(job.data.event),
        );
        await this.appendToEventstore(job.data.streamName, job.data.event);
      },
      this.internalEventsQueueConf.options,
    );
  }

  public async emit(
    streamName: string,
    event: EventstoreEvent<any, any>,
  ): Promise<void> {
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
      await this.appendToEventstore(streamName, formattedEvent);
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

  private async appendToEventstore(
    streamName: string,
    formattedEvent: any,
  ): Promise<void> {
    const client: Client = await this.connection.getConnectedClient();
    await client.appendToStream(streamName, formattedEvent);
    this.logger.debug(
      'Event appended on eventstore: ' + JSON.stringify(formattedEvent),
    );
  }
}
