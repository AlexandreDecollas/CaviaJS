import { PersistentSubscriptionSettings } from '@eventstore/db-client/dist/utils/persistentSubscriptionSettings';

export interface PersistentSubscriptionConfiguration {
  name: string;
  streamName: string;
  groupName: string;
  settings?: Partial<PersistentSubscriptionSettings>;
}
