import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RedisQueueConfiguration } from '../../event-modelling.configuration';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import {
  EXTERNAL_EVENT_HOOK,
  EXTERNAL_EVENT_HOOK_METADATA,
  PERSUB_EVENT_HOOK,
  PERSUB_HOOK_METADATA,
} from '../../constants';
import {
  fetchConnectedPersistentSubscriptions,
  ProvidedPersistentSubscriptions,
} from '../../eventstore-connector/persistent-subscription/provider/persistent-suscriptions.provider';
import {
  EventType,
  PARK,
  PersistentSubscription,
  ResolvedEvent,
} from '@eventstore/db-client';
import { Worker } from 'bullmq';
import { PersubHookMetadata } from '../../command-decorators/method-decorator/persub-event-hook.decorator';

@Injectable()
export class ExternalEntryPointListenerStarterService
  implements OnApplicationBootstrap
{
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly logger: Logger,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    this.plugPersistentSubscriptionHooks();
    this.plugExternalEventsHooks();
  }

  private plugPersistentSubscriptionHooks(): void {
    const persubHooks: InstanceWrapper[] =
      this.getHookableCommands(PERSUB_HOOK_METADATA);

    const persistentSubscriptions: ProvidedPersistentSubscriptions =
      fetchConnectedPersistentSubscriptions();

    persubHooks.forEach((persubHookContainer: InstanceWrapper): void => {
      this.plugPersistentSubscriptionHook(
        persubHookContainer,
        persistentSubscriptions,
      );
    });
  }

  private plugPersistentSubscriptionHook(
    persubHookContainer: InstanceWrapper<any>,
    persistentSubscriptions: ProvidedPersistentSubscriptions,
  ): void {
    const persubName = Reflect.getMetadata(
      PERSUB_HOOK_METADATA,
      persubHookContainer.metatype,
    );

    const persistentSubscription: PersistentSubscription =
      persistentSubscriptions[persubName];
    persistentSubscription.on('data', async (payloadEvent: ResolvedEvent) => {
      await this.welcomeNewEvent(
        persubHookContainer,
        payloadEvent,
        persistentSubscription,
      );
    });
  }

  private async welcomeNewEvent(
    persubHookContainer: InstanceWrapper<any>,
    payloadEvent: ResolvedEvent<EventType>,
    persistentSubscription: PersistentSubscription<EventType>,
  ): Promise<void> {
    try {
      const persubHookmetadatas: PersubHookMetadata[] = Reflect.getMetadata(
        PERSUB_EVENT_HOOK,
        persubHookContainer.metatype.prototype,
      );
      for (const persubHookMetadata of persubHookmetadatas) {
        const index = persubHookmetadatas.indexOf(persubHookMetadata);
        this.updateEventsSequenceState(
          persubHookmetadatas,
          persubHookMetadata,
          payloadEvent,
          persubHookContainer,
        );
        if (this.eventsSequenceIsNotCompletedYet(persubHookMetadata)) {
          return;
        }
        this.reinitEventsSequence(persubHookmetadatas, index);
        this.triggerPersubEventHook(
          persubHookContainer,
          persubHookMetadata,
          payloadEvent,
        );
        await persistentSubscription.ack(payloadEvent);
      }
    } catch (e) {
      await persistentSubscription.nack(PARK, e.message, payloadEvent);
    }
  }

  private updateEventsSequenceState(
    metadatas: PersubHookMetadata[],
    currentMetadata: PersubHookMetadata,
    payloadEvent: ResolvedEvent<EventType>,
    persubHookContainer: InstanceWrapper<any>,
  ): void {
    if (
      this.allEventsAreAllowed(currentMetadata) ||
      this.currentEventIsNotAllowed(currentMetadata, payloadEvent)
    ) {
      return;
    }
    this.takeNoteThatOneOfAllowedEventsHappened(currentMetadata, payloadEvent);
    this.updateStateInHookMetadatas(metadatas, persubHookContainer);
  }

  private updateStateInHookMetadatas(
    metadatas: PersubHookMetadata[],
    persubHookContainer: InstanceWrapper<any>,
  ): void {
    Reflect.defineMetadata(
      PERSUB_EVENT_HOOK,
      metadatas,
      persubHookContainer.metatype.prototype,
    );
  }

  private currentEventIsNotAllowed(
    metadata: PersubHookMetadata,
    payloadEvent: ResolvedEvent<EventType>,
  ) {
    return (
      metadata.allowedEventTypes.indexOf(
        payloadEvent.event.constructor.name,
      ) === -1
    );
  }

  private allEventsAreAllowed(metadata: PersubHookMetadata): boolean {
    return metadata.allowedEventTypes.length === 0;
  }

  private takeNoteThatOneOfAllowedEventsHappened(
    metadata: PersubHookMetadata,
    payloadEvent: ResolvedEvent<EventType>,
  ) {
    metadata.sequenceState[payloadEvent.event.constructor.name] = true;
  }

  private triggerPersubEventHook(
    persubHookContainer: InstanceWrapper<any>,
    metadata: PersubHookMetadata,
    payloadEvent: ResolvedEvent<EventType>,
  ) {
    persubHookContainer.instance[metadata.method](payloadEvent.event);
  }

  private eventsSequenceIsNotCompletedYet(
    metadata: PersubHookMetadata,
  ): boolean {
    return (
      metadata.allowedEventTypes.length !==
      Object.keys(metadata.sequenceState).length
    );
  }

  private reinitEventsSequence(
    metadatas: PersubHookMetadata[],
    index: number,
  ): void {
    (metadatas[index] as PersubHookMetadata).sequenceState = {};
  }

  private plugExternalEventsHooks(): void {
    const externalEventsHookCommands = this.getHookableCommands(
      EXTERNAL_EVENT_HOOK_METADATA,
    );

    externalEventsHookCommands.forEach(
      (externalEventsHook: InstanceWrapper) => {
        const externalEventQueueConf: RedisQueueConfiguration =
          Reflect.getMetadata(
            EXTERNAL_EVENT_HOOK_METADATA,
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
      },
    );
  }

  private getHookableCommands(hookTypeMetadata: string): InstanceWrapper[] {
    return this.discoveryService
      .getControllers()
      .filter((command: InstanceWrapper) =>
        Reflect.hasMetadata(hookTypeMetadata, command.metatype),
      );
  }
}
