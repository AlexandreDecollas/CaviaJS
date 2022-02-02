import { Test, TestingModule } from '@nestjs/testing';
import * as BullMQ from 'bullmq';
import { DiscoveryService } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { provideConnectedPersistentSubscription } from '../../eventstore-connector/persistent-subscription/provider/persistent-suscriptions.provider';
import { PersubEventHook } from '../../command-decorators/method-decorator/persub-event-hook.decorator';
import { PARK } from '@eventstore/db-client';
import { ExternalEventHook } from '../../command-decorators/method-decorator/external-event-hook.decorator';
import { RedisQueueConfiguration } from '../../event-modelling.configuration';
import { Command } from '../../command-decorators/class-decorators/command.decorator';
import { ExternalEntryPointListenerStarterService } from './external-entry-point-listener-starter.service';
import spyOn = jest.spyOn;
import { EventstoreEvent } from '../../../model/eventstoreEvent';

describe('ExternalEntryPointListenerStarterService', () => {
  let service: ExternalEntryPointListenerStarterService;

  const persubHandlerSpy = jest.fn();
  const externalEventHandlerSpy = jest.fn();
  const onEventHandlerSpy = jest.fn();
  const ackSpy = jest.fn();
  const nackSpy = jest.fn();

  class AllowedEvent extends EventstoreEvent {
    type: 'AllowedEvent';
  }

  const redisConf: RedisQueueConfiguration = {
    options: {
      connection: { host: 'hostname', port: 1234 },
    },
    queueName: 'redisQueue',
  };
  @Command({ persubName: 'persubName', externalEventQueue: redisConf })
  class TotoCommand {
    @PersubEventHook()
    public toto(...args): void {
      persubHandlerSpy(args);
    }

    @PersubEventHook(AllowedEvent)
    public titi(...args): void {
      persubHandlerSpy(args);
    }

    @ExternalEventHook
    tutu(...args) {
      externalEventHandlerSpy(args);
    }
  }

  provideConnectedPersistentSubscription('persubName', {
    on: onEventHandlerSpy,
    ack: ackSpy,
    nack: nackSpy,
  } as any);

  beforeEach(async () => {
    jest.resetAllMocks();
    spyOn(console, 'warn');
    spyOn(BullMQ, 'Worker').mockImplementation(() => null);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalEntryPointListenerStarterService,
        DiscoveryService,
        {
          provide: Logger,
          useValue: { debug: jest.fn() },
        },
      ],
      imports: [TotoCommand],
    }).compile();
    service = module.get<ExternalEntryPointListenerStarterService>(
      ExternalEntryPointListenerStarterService,
    );

    await service.onApplicationBootstrap();
  });

  describe('on persistent subscriptions event hookd', () => {
    let hook;

    beforeEach(() => {
      hook = onEventHandlerSpy.mock.calls[0][1];
    });

    it('should plug all persistent subscriptions provided in features to eventstore at app bootstrap', async () => {
      await hook({});
      expect(onEventHandlerSpy).toHaveBeenCalled();
    });

    it('should nack an event when it is invalid', async () => {
      await hook(null);
      await expect(nackSpy).toHaveBeenCalledWith(
        PARK,
        expect.any(String),
        null,
      );
    });

    it('should ack an event when it is valid', async () => {
      const payload = { event: 123 };
      await hook(payload);
      await expect(ackSpy).toHaveBeenCalledWith(payload);
    });

    it('should call the specified handler in the command', async () => {
      const payload = { event: 123 };
      await hook(payload);
      await expect(persubHandlerSpy).toHaveBeenCalledWith([123]);
    });

    it('should trigger hook only when allowed event is emitted', async () => {
      class ForbindenEvent extends EventstoreEvent {
        type: 'ForbindenEvent';
        data: { toto: 123 };
      }

      const forbidenEvent: ForbindenEvent = new ForbindenEvent();
      const payload = { event: forbidenEvent };
      await hook(payload);
      await expect(persubHandlerSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should make all external events listener start listening at app bootstrap', async () => {
    expect(BullMQ.Worker['mock'].calls[0]).toEqual([
      'redisQueue',
      expect.any(Function),
      { connection: redisConf.options },
    ]);
  });

  it('should call the specified handler in the command', async () => {
    const hook = BullMQ.Worker['mock'].calls[0][1];
    const payload = { data: 123 };
    await hook(payload);
    await expect(externalEventHandlerSpy).toHaveBeenCalledWith([123]);
  });
});
