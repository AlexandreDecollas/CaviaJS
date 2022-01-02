import { PersistentSubscriptionConfiguration } from '../persistent-subscription-configuration';
import { PersistentSubscription } from '@eventstore/db-client';

export type ProvidedPersistentSubscriptionsConfigurations = {
  [key: string]: PersistentSubscriptionConfiguration;
};
export const providedPersistentSubscriptionsConfigurations: ProvidedPersistentSubscriptionsConfigurations =
  {};

export const providePersistentSubscription = (
  persistentSubscription: PersistentSubscriptionConfiguration,
): void => {
  providedPersistentSubscriptionsConfigurations[persistentSubscription.name] =
    persistentSubscription;
};
export const fetchProvidedPersistentSubscriptionsConfigurations =
  (): ProvidedPersistentSubscriptionsConfigurations => {
    return providedPersistentSubscriptionsConfigurations;
  };

export type ProvidedPersistentSubscriptions = {
  [key: string]: PersistentSubscription;
};
const providedPersistentSubscriptions: ProvidedPersistentSubscriptions = {};

export const provideConnectedPersistentSubscription = (
  persustentSubscriptionName: string,
  persistentSubscription: PersistentSubscription,
): void => {
  providedPersistentSubscriptions[persustentSubscriptionName] =
    persistentSubscription;
};

export const fetchConnectedPersistentSubscriptions =
  (): ProvidedPersistentSubscriptions => {
    return providedPersistentSubscriptions;
  };
