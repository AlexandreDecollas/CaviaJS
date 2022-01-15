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
import {
  EXTERNAL_EVENT_HOOK,
  PERSUB_HOOK_METADATA,
  REDIS_HOOK_METADATA,
} from '../constants';
import { REDIS_QUEUE_CONFIGURATION } from './constants';
import { RedisQueueConfiguration } from '../event-modelling.configuration';
import { Queue, Worker } from 'bullmq';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

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
    this.plugExternalEventsHooks();
    this.plugRedisQueue();
  }

  private plugRedisQueue(): void {
    if (this.redisQueueConf) {
      new Worker(
        this.redisQueueConf.queueName,
        async (event) => {
          this.logger.debug(
            'Event hooked on internal event queue : ' +
              JSON.stringify(event.data),
          );
          await this.appendToEventstore(event.data);
        },
        this.redisQueueConf.options,
      );
    }
  }

  private plugPersistentSubscriptionHooks(): void {
    const persubHooks = [];
    const controllers = this.discoveryService.getControllers();
    controllers.forEach((controller: InstanceWrapper) => {
      if (Reflect.hasMetadata(PERSUB_HOOK_METADATA, controller.metatype)) {
        persubHooks.push(controller);
      }
    });

    persubHooks.forEach((persubHookContainer: InstanceWrapper): void => {
      const persubName = Reflect.getMetadata(
        PERSUB_HOOK_METADATA,
        persubHookContainer.metatype,
      );

      const persistentSubscriptions: ProvidedPersistentSubscriptions =
        fetchConnectedPersistentSubscriptions();
      const persistentSubscription: PersistentSubscription =
        persistentSubscriptions[persubName];
      persistentSubscription.on('data', async (payloadEvent: ResolvedEvent) => {
        try {
          const hookMethod = Reflect.getMetadata(
            EXTERNAL_EVENT_HOOK,
            persubHookContainer.instance,
          );

          persubHookContainer.instance[hookMethod](payloadEvent.event);
          await persistentSubscription.ack(payloadEvent);
        } catch (e) {
          await persistentSubscription.nack(PARK, e.message, payloadEvent);
        }
      });
    });
  }

  private plugExternalEventsHooks(): void {
    const externalEventsHooks = [];
    const controllers: InstanceWrapper[] =
      this.discoveryService.getControllers();
    controllers.forEach((controller) => {
      if (Reflect.hasMetadata(REDIS_HOOK_METADATA, controller.metatype)) {
        externalEventsHooks.push(controller);
      }
    });

    externalEventsHooks.forEach((externalEventsHook: InstanceWrapper) => {
      const externalEventQueueConf = Reflect.getMetadata(
        REDIS_HOOK_METADATA,
        externalEventsHook.metatype,
      );
      new Worker(
        externalEventQueueConf.queueName,
        async (event) => {
          this.logger.debug(
            `Event hooked on Redis (queueName : ${
              externalEventQueueConf.queueName
            }): ${JSON.stringify(event.data)}`,
          );
          const hookMethod = Reflect.getMetadata(
            EXTERNAL_EVENT_HOOK,
            externalEventsHook.instance,
          );

          externalEventsHook.instance[hookMethod](event.data);
        },
        { connection: externalEventQueueConf.options },
      );
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

  private async pushEventOnRedisQueue(formattedEvent: any): Promise<void> {
    const messagesQueue = new Queue(
      this.redisQueueConf.queueName,
      this.redisQueueConf.options,
    );
    await messagesQueue.add(this.redisQueueConf.queueName, formattedEvent, {
      removeOnComplete: true,
      removeOnFail: 1000,
    });

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
