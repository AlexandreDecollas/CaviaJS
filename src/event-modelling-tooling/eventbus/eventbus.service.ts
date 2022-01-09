import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventstoreEvent } from '../../model/eventstoreEvent';
import { ESDBConnectionService } from '../eventstore-connector/connection-initializer/esdb-connection.service';
import {
  jsonEvent,
  PARK,
  PersistentSubscription,
  ResolvedEvent,
} from '@eventstore/db-client';
import { Client } from '@eventstore/db-client/dist/Client';
import { DiscoveryService } from '@nestjs/core';
import {
  fetchConnectedPersistentSubscriptions,
  ProvidedPersistentSubscriptions,
} from '../eventstore-connector/persistent-subscription/provider/persistent-suscriptions.provider';
import { PERSUB_HOOK_METADATA } from '../constants';
import { REDIS_QUEUE_CONFIGURATION } from './constants';
import { RedisQueueConfiguration } from '../event-modelling.configuration';
import { Queue, Worker } from 'bullmq';

@Injectable()
export class Eventbus implements OnApplicationBootstrap {
  constructor(
    @Inject(REDIS_QUEUE_CONFIGURATION)
    private readonly redisQueueConf: RedisQueueConfiguration,
    private readonly discoveryService: DiscoveryService,
    private readonly connection: ESDBConnectionService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: Logger,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    this.plugPersistentSubscriptionHooks();
    this.plugRedisQueue();
  }

  private plugRedisQueue() {
    if (this.redisQueueConf) {
      new Worker(
        this.redisQueueConf.queueName,
        async (event) => {
          this.logger.log(
            'Event hooked on Redis : ' + JSON.stringify(event.data),
          );
          await this.appendToEventstore(event.data);
        },
        this.redisQueueConf.options,
      );
    }
  }

  private plugPersistentSubscriptionHooks() {
    const persubHooks = [];
    const controllers = this.discoveryService.getControllers();
    controllers.forEach((controller) => {
      if (Reflect.hasMetadata(PERSUB_HOOK_METADATA, controller.metatype)) {
        persubHooks.push(controller);
      }
    });

    persubHooks.forEach((persubHook) => {
      const persubName = Reflect.getMetadata(
        PERSUB_HOOK_METADATA,
        persubHook.metatype,
      );

      const persistentSubscriptions: ProvidedPersistentSubscriptions =
        fetchConnectedPersistentSubscriptions();
      const paymentProcessorPersub: PersistentSubscription =
        persistentSubscriptions[persubName];
      paymentProcessorPersub.on('data', async (payloadEvent: ResolvedEvent) => {
        try {
          persubHook.persubCallback(payloadEvent.event as any);
          await paymentProcessorPersub.ack(payloadEvent);
        } catch (e) {
          await paymentProcessorPersub.nack(PARK, e.message, payloadEvent);
        }
      });
    });
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

    if (this.redisQueueConf) {
      await this.pushEventOnRedisQueue(formattedEvent);
    } else {
      await this.appendToEventstore(formattedEvent);
    }
  }

  private async pushEventOnRedisQueue(formattedEvent: any) {
    const messagesQueue = new Queue(
      this.redisQueueConf.queueName,
      this.redisQueueConf.options,
    );
    await messagesQueue.add(this.redisQueueConf.queueName, formattedEvent, {
      removeOnComplete: true,
      removeOnFail: 1000,
    });

    this.logger.log('Event queued on redis: ' + JSON.stringify(formattedEvent));
  }

  private async appendToEventstore(formattedEvent: any): Promise<void> {
    const client: Client = await this.connection.getConnectedClient();
    await client.appendToStream(
      formattedEvent.metadata.streamName,
      formattedEvent,
    );
    this.logger.log(
      'Event appended on eventstore: ' + JSON.stringify(formattedEvent),
    );
  }
}
