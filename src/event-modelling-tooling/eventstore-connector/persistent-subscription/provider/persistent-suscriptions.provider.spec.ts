import {
  fetchConnectedPersistentSubscriptions,
  fetchProvidedPersistentSubscriptionsConfigurations,
  provideConnectedPersistentSubscription,
  ProvidedPersistentSubscriptions,
  ProvidedPersistentSubscriptionsConfigurations,
  providePersistentSubscription,
} from './persistent-suscriptions.provider';

describe('Persistent subscription provider', () => {
  it('should merge persub confs provided all over the codebase', () => {
    providePersistentSubscription({
      name: 'toto',
      groupName: 'group',
      streamName: 'stream',
    });

    providePersistentSubscription({
      name: 'tutu',
      groupName: 'group',
      streamName: 'stream',
    });

    const confs: ProvidedPersistentSubscriptionsConfigurations =
      fetchProvidedPersistentSubscriptionsConfigurations();

    expect(confs['toto']).toBeTruthy();
    expect(confs['tutu']).toBeTruthy();
  });

  it('should give access to connected persub by name given in the conf', () => {
    provideConnectedPersistentSubscription('toto', {} as any);
    provideConnectedPersistentSubscription('tutu', {} as any);

    const persistentSubscriptions: ProvidedPersistentSubscriptions =
      fetchConnectedPersistentSubscriptions();

    expect(persistentSubscriptions['toto']).toBeTruthy();
    expect(persistentSubscriptions['tutu']).toBeTruthy();
  });
});
