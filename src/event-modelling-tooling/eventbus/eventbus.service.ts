import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
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

@Injectable()
export class Eventbus implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly connection: ESDBConnectionService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: Logger,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
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
          await paymentProcessorPersub.nack(PARK, e);
        }
      });
    });
  }

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
