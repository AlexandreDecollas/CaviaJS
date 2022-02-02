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
      const persubName = Reflect.getMetadata(
        PERSUB_HOOK_METADATA,
        persubHookContainer.metatype,
      );

      const persistentSubscription: PersistentSubscription =
        persistentSubscriptions[persubName];
      persistentSubscription.on('data', async (payloadEvent: ResolvedEvent) => {
        try {
          const metadatas: PersubHookMetadata[] = Reflect.getMetadata(
            PERSUB_EVENT_HOOK,
            persubHookContainer.metatype.prototype,
          );
          for (const metadata of metadatas) {
            if (
              metadata.allowedEventType !== '*' &&
              metadata.allowedEventType !== (payloadEvent as any).type
            ) {
              return;
            }
            persubHookContainer.instance[metadata.method](payloadEvent.event);
            await persistentSubscription.ack(payloadEvent);
          }
        } catch (e) {
          await persistentSubscription.nack(PARK, e.message, payloadEvent);
        }
      });
    });
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
