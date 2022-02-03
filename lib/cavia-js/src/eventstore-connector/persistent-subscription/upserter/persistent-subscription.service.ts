import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ESDBConnectionService } from '../../connection-initializer';
import { Client } from '@eventstore/db-client/dist/Client';
import { PersistentSubscriptionConfiguration } from '../persistent-subscription-configuration';
import {
  PersistentSubscription,
  persistentSubscriptionSettingsFromDefaults,
} from '@eventstore/db-client';
import {
  fetchProvidedPersistentSubscriptionsConfigurations,
  provideConnectedPersistentSubscription,
  ProvidedPersistentSubscriptionsConfigurations,
} from '../provider/persistent-suscriptions.provider';

@Injectable()
export class PersistentSubscriptionService implements OnModuleInit {
  constructor(
    private readonly connection: ESDBConnectionService,
    private readonly logger: Logger,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.connectToPersistentSubscriptions();
  }

  private async connectToPersistentSubscriptions(): Promise<void> {
    const client: Client = await this.connection.getConnectedClient();

    const persistentSubscriptionsConfigurations: ProvidedPersistentSubscriptionsConfigurations =
      fetchProvidedPersistentSubscriptionsConfigurations();
    const persubNames: string[] = Object.keys(
      persistentSubscriptionsConfigurations,
    );
    for (const persubName of persubNames) {
      const persub = await this.connectToPersistentSubscription(
        persistentSubscriptionsConfigurations,
        persubName,
        client,
      );
      provideConnectedPersistentSubscription(persubName, persub);
    }
  }

  private async connectToPersistentSubscription(
    persistentSubscriptionsConfigurations: ProvidedPersistentSubscriptionsConfigurations,
    persubName: string,
    client: Client,
  ) {
    const persubConf: PersistentSubscriptionConfiguration =
      persistentSubscriptionsConfigurations[persubName];

    await this.upsertPersistentSubscription(persubConf);

    this.logger.log(
      `Connecting to persistent subscription \n\tstreamName: ${persubConf.streamName}\n\tgroup: ${persubConf.groupName} `,
    );
    const persub: PersistentSubscription =
      client.connectToPersistentSubscription(
        persubConf.streamName,
        persubConf.groupName,
      );
    this.logger.log(
      `Persistent subscription \n\tstreamName: ${persubConf.streamName}\n\tgroup: ${persubConf.groupName} \n\t-> connected. `,
    );
    return persub;
  }

  private async upsertPersistentSubscription(
    persub: PersistentSubscriptionConfiguration,
  ): Promise<void> {
    const client: Client = await this.connection.getConnectedClient();
    try {
      await client.updatePersistentSubscription(
        persub.streamName,
        persub.groupName,
        {
          ...persistentSubscriptionSettingsFromDefaults(),
          ...persub.settings,
        },
        {
          credentials: {
            username: process.env.EVENTSTORE_USERNAME || 'admin',
            password: process.env.EVENTSTORE_PASSWORD || 'changeit',
          },
        },
      );
    } catch (e) {
      await client.createPersistentSubscription(
        persub.streamName,
        persub.groupName,
        {
          ...persistentSubscriptionSettingsFromDefaults(),
          ...persub.settings,
        },
        {
          credentials: {
            username: process.env.EVENTSTORE_USERNAME || 'admin',
            password: process.env.EVENTSTORE_PASSWORD || 'changeit',
          },
        },
      );
    }
  }
}
