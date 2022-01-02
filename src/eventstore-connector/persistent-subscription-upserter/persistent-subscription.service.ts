import { Injectable } from '@nestjs/common';
import { ESDBConnectionService } from '../connection-initializer/esdb-connection.service';
import { Client } from '@eventstore/db-client/dist/Client';
import { PersistentSubscriptionConfiguration } from './persistent-subscription-configuration';
import {
  PersistentSubscription,
  persistentSubscriptionSettingsFromDefaults,
} from '@eventstore/db-client';

@Injectable()
export class PersistentSubscriptionService {
  constructor(private readonly connection: ESDBConnectionService) {}

  public async connectToPersistentSubscription(
    persubConf: PersistentSubscriptionConfiguration,
  ): Promise<PersistentSubscription> {
    const client: Client = await this.connection.getConnectedClient();
    await PersistentSubscriptionService.upsertPersistentSubscription(
      client,
      persubConf,
    );
    return client.connectToPersistentSubscription(
      persubConf.streamName,
      persubConf.groupName,
    );
  }

  private static async upsertPersistentSubscription(
    client: Client,
    persub: PersistentSubscriptionConfiguration,
  ): Promise<void> {
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
