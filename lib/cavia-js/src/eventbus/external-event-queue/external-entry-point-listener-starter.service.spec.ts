import { Test, TestingModule } from '@nestjs/testing';
import * as BullMQ from 'bullmq';
import { DiscoveryService } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import {
  EventstoreEvent,
  ExternalEntryPointListenerStarterService,
  provideConnectedPersistentSubscription,
} from 'cavia-js';
import { PARK } from '@eventstore/db-client';
import {
  ackSpy,
  AllowedEvent1,
  AllowedEvent2,
  AllowedEvent3,
  externalEventHandlerSpy,
  nackSpy,
  persubAllEventHandlerSpy,
  persubHookHandlerSpy1,
  persubHookHandlerSpy2,
  persubHookHandlerSpy3,
  persubOnEventSequenceHandlerSpy,
  persubOnlyOneEventHandlerSpy,
  redisConf,
  TeteCommand,
  TotoCommand,
  TutuCommand,
} from './helpers/external-entry-point-listener-starter.service.spec.helper';
import spyOn = jest.spyOn;

describe('ExternalEntryPointListenerStarterService', () => {
  let service: ExternalEntryPointListenerStarterService;

  beforeAll(() => {
    provideConnectedPersistentSubscription('persubName1', {
      on: persubHookHandlerSpy1,
      ack: ackSpy,
      nack: nackSpy,
    } as any);

    provideConnectedPersistentSubscription('persubName2', {
      on: persubHookHandlerSpy2,
      ack: ackSpy,
      nack: nackSpy,
    } as any);

    provideConnectedPersistentSubscription('persubName3', {
      on: persubHookHandlerSpy3,
      ack: ackSpy,
      nack: nackSpy,
    } as any);
  });

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
      controllers: [TotoCommand, TutuCommand, TeteCommand],
    }).compile();
    service = module.get<ExternalEntryPointListenerStarterService>(
      ExternalEntryPointListenerStarterService,
    );
  });

  describe('on persistent subscriptions event hooked', () => {
    let hookPersub1;
    let hookPersub2;
    let hookPersub3;
    const allowedEvent1 = new AllowedEvent1();
    const allowedEvent2 = new AllowedEvent2();
    const allowedEvent3 = new AllowedEvent3();

    beforeEach(async () => {
      jest.resetAllMocks();
      await service.onApplicationBootstrap();
      hookPersub1 = persubHookHandlerSpy1.mock.calls[0][1];
      hookPersub2 = persubHookHandlerSpy2.mock.calls[0][1];
      hookPersub3 = persubHookHandlerSpy3.mock.calls[0][1];
    });

    it('should plug all persistent subscriptions provided in features to eventstore at app bootstrap', async () => {
      await hookPersub1({});
      expect(persubHookHandlerSpy1).toHaveBeenCalled();
    });

    it('should nack an event when it is invalid', async () => {
      await hookPersub1(null);
      await expect(nackSpy).toHaveBeenCalledWith(
        PARK,
        expect.any(String),
        null,
      );
    });

    it('should ack an event when it is valid', async () => {
      const payload = { event: 123 };
      await hookPersub1(payload);
      await expect(ackSpy).toHaveBeenCalledWith(payload);
    });

    it('should call the specified handler in the command', async () => {
      const payload = { event: 123 };
      await hookPersub1(payload);
      await expect(persubAllEventHandlerSpy).toHaveBeenCalledWith([123]);
    });

    it('should trigger hook only when allowed event is emitted', async () => {
      class ForbindenEvent extends EventstoreEvent {
        type: 'ForbindenEvent';
        data: { toto: 123 };
      }
      const forbidenEvent: ForbindenEvent = new ForbindenEvent();
      const payload = { event: forbidenEvent };

      await hookPersub2(payload);
      expect(persubOnlyOneEventHandlerSpy).not.toHaveBeenCalled();
    });

    it('should not trigger the hook when each event of the sequence is not spotted at least once each', async () => {
      await hookPersub3({ event: allowedEvent1 });
      await hookPersub3({ event: allowedEvent2 });

      await expect(persubOnEventSequenceHandlerSpy).not.toHaveBeenCalled();
    });

    it('should trigger the hook when each event of the sequence is spotted at least once each', async () => {
      await hookPersub3({ event: allowedEvent1 });
      await hookPersub3({ event: allowedEvent2 });
      await hookPersub3({ event: allowedEvent3 });

      await expect(persubOnEventSequenceHandlerSpy).toHaveBeenCalledTimes(1);
    });

    it('should reset the sequence once the hook is triggered based on the sequence', async () => {
      await hookPersub3({ event: allowedEvent1 });
      await hookPersub3({ event: allowedEvent2 });
      await hookPersub3({ event: allowedEvent3 });

      await hookPersub3({ event: allowedEvent1 });
      await hookPersub3({ event: allowedEvent2 });
      await expect(persubOnEventSequenceHandlerSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('on external event hooked', () => {
    beforeEach(async () => {
      await service.onApplicationBootstrap();
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
});
