import { PersistentSubscriptionSettings } from '@eventstore/db-client/dist/utils/persistentSubscriptionSettings';

export interface PersistentSubscriptionConfiguration {
  streamName: string;
  groupName: string;
  settings?: PersistentSubscriptionSettings;
}
