import {
  AllEventsHook,
  Command,
  EventstoreEvent,
  EventstoreEventMetadata,
  ExternalEventHook,
  RedisQueueConfiguration,
  Saga,
  SingleEventHook,
} from 'cavia-js';

export class AllowedEvent1 extends EventstoreEvent<
  any,
  EventstoreEventMetadata
> {}
export class AllowedEvent2 extends EventstoreEvent<
  any,
  EventstoreEventMetadata
> {}
export class AllowedEvent3 extends EventstoreEvent<
  any,
  EventstoreEventMetadata
> {}

export const redisConf: RedisQueueConfiguration = {
  options: {
    connection: { host: 'hostname', port: 1234 },
  },
  queueName: 'redisQueue',
};

export const persubAllEventHandlerSpy = jest.fn();
export const persubOnlyOneEventHandlerSpy = jest.fn();
export const persubOnEventSequenceHandlerSpy = jest.fn();

export const persubHookHandlerSpy1 = jest.fn();
export const persubHookHandlerSpy2 = jest.fn();
export const persubHookHandlerSpy3 = jest.fn();
export const externalEventHandlerSpy = jest.fn();
export const ackSpy = jest.fn();
export const nackSpy = jest.fn();

@Command({ persubName: 'persubName1', externalEventQueue: redisConf })
export class TotoCommand {
  @AllEventsHook()
  public toto(...args): void {
    persubAllEventHandlerSpy(args);
  }

  @ExternalEventHook
  tutu(...args) {
    externalEventHandlerSpy(args);
  }
}

@Command({ persubName: 'persubName2', externalEventQueue: redisConf })
export class TutuCommand {
  @SingleEventHook(AllowedEvent1)
  public titi(...args): void {
    persubOnlyOneEventHandlerSpy(args);
  }
}

@Command({ persubName: 'persubName3', externalEventQueue: redisConf })
export class TeteCommand {
  @Saga([AllowedEvent1, AllowedEvent2, AllowedEvent3])
  public tata(...args): void {
    persubOnEventSequenceHandlerSpy(args);
  }
}
