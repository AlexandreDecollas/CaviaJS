import { Command } from '../../../command-decorators/class-decorators/command.decorator';
import { PersubEventHook } from '../../../command-decorators/method-decorator/persub-event-hook.decorator';
import { ExternalEventHook } from '../../../command-decorators/method-decorator/external-event-hook.decorator';
import { EventstoreEvent } from '../../../../model/eventstoreEvent';
import { RedisQueueConfiguration } from '../../../event-modelling.configuration';

export class AllowedEvent1 extends EventstoreEvent {
  type: 'AllowedEvent1';
}

export class AllowedEvent2 extends EventstoreEvent {
  type: 'AllowedEvent2';
}

export class AllowedEvent3 extends EventstoreEvent {
  type: 'AllowedEvent3';
}

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
  @PersubEventHook()
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
  @PersubEventHook([AllowedEvent1])
  public titi(...args): void {
    persubOnlyOneEventHandlerSpy(args);
  }
}

@Command({ persubName: 'persubName3', externalEventQueue: redisConf })
export class TeteCommand {
  @PersubEventHook([AllowedEvent1, AllowedEvent2, AllowedEvent3])
  public tata(...args): void {
    persubOnEventSequenceHandlerSpy(args);
  }
}
