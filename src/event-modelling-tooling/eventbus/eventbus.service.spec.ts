import { Eventbus } from './eventbus.service';
import {
  PERSUB_HOOK_METADATA,
  EXTERNAL_EVENT_HOOK_METADATA,
} from '../constants';
import {
  fetchConnectedPersistentSubscriptions,
  fetchProvidedPersistentSubscriptionsConfigurations,
  provideConnectedPersistentSubscription,
} from '../eventstore-connector/persistent-subscription/provider/persistent-suscriptions.provider';
import { ExternalEventHook } from '../command-decorators/method-decorator/external-event-hook.decorator';
import { PARK } from '@eventstore/db-client';
import { ESDBConnectionService } from '../eventstore-connector/connection-initializer/esdb-connection.service';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INTERNAL_EVENTS_QUEUE_CONFIGURATION } from './constants';
import { DiscoveryService } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PersubEventHook } from '../command-decorators/method-decorator/persub-event-hook.decorator';
import * as BullMQ from 'bullmq';
import spyOn = jest.spyOn;
import { RedisQueueConfiguration } from '../event-modelling.configuration';

describe('Eventbus', () => {
  let service: Eventbus;

  const redisQueueConfMock = {
    queueName: 'tutu',
    connection: { host: '', port: 1234 },
  } as any;
  const discoveryServiceMock = {
    getControllers: jest.fn(),
  } as any;
  const connectionMock = {} as any;
  const eventEmitter2Mock = {} as any;
  const loggerMock = { debug: jest.fn() } as any;
  spyOn(BullMQ, 'Worker').mockImplementation(() => null);

  beforeEach(async () => {
    spyOn(console, 'warn');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Eventbus,
        {
          provide: INTERNAL_EVENTS_QUEUE_CONFIGURATION,
          useValue: redisQueueConfMock,
        },
        {
          provide: DiscoveryService,
          useValue: discoveryServiceMock,
        },
        {
          provide: ESDBConnectionService,
          useValue: connectionMock,
        },
        {
          provide: EventEmitter2,
          useValue: eventEmitter2Mock,
        },
        {
          provide: Logger,
          useValue: loggerMock,
        },
      ],
    }).compile();
    service = module.get<Eventbus>(Eventbus);

    const persubs = fetchProvidedPersistentSubscriptionsConfigurations();
    Object.keys(persubs).forEach((key: string) => delete persubs[key]);

    const connectedPersubs = fetchConnectedPersistentSubscriptions();
    Object.keys(connectedPersubs).forEach(
      (key: string) => delete connectedPersubs[key],
    );
    jest.resetAllMocks();
  });

  describe('persistent subscription management', () => {
    const handlerSpy = jest.fn();

    class Command {
      toto(...args) {
        handlerSpy(args);
      }
    }
    const command = new Command();
    const controllers = [{ metatype: command, instance: command }];

    PersubEventHook(command, 'toto');

    const onEventHandlerSpy = jest.fn();
    const ackSpy = jest.fn();
    const nackSpy = jest.fn();

    beforeEach(async () => {
      provideConnectedPersistentSubscription('persubName', {
        on: onEventHandlerSpy,
        ack: ackSpy,
        nack: nackSpy,
      } as any);
      Reflect.defineMetadata(
        PERSUB_HOOK_METADATA,
        'persubName',
        controllers[0].metatype,
      );
      discoveryServiceMock.getControllers.mockReturnValue(controllers);

      await service.onApplicationBootstrap();
    });

    it('should plug all persistent subscriptions provided in features to eventstore at app bootstrap', async () => {
      const hook = onEventHandlerSpy.mock.calls[0][1];
      await hook({});
      expect(onEventHandlerSpy).toHaveBeenCalled();
    });

    it('should nack an event when it is invalid', async () => {
      const hook = onEventHandlerSpy.mock.calls[0][1];
      await hook(null);
      await expect(nackSpy).toHaveBeenCalledWith(
        PARK,
        expect.any(String),
        null,
      );
    });

    it('should ack an event when it is valid', async () => {
      const hook = onEventHandlerSpy.mock.calls[0][1];
      const payload = { event: 123 };
      await hook(payload);
      await expect(ackSpy).toHaveBeenCalledWith(payload);
    });

    it('should call the specified handler in the command', async () => {
      const hook = onEventHandlerSpy.mock.calls[0][1];
      const payload = { event: 123 };
      await hook(payload);
      await expect(handlerSpy).toHaveBeenCalledWith([123]);
    });
  });

  describe('External events management', () => {
    const handlerSpy = jest.fn();

    class Command {
      toto(...args) {
        handlerSpy(args);
      }
    }
    const command = new Command();
    const controllers = [{ metatype: command, instance: command }];

    ExternalEventHook(command, 'toto');

    const redisConf: RedisQueueConfiguration = {
      options: {
        connection: { host: 'hostname', port: 1234 },
      },
      queueName: 'redisQueue',
    };

    beforeEach(async () => {
      Reflect.defineMetadata(
        EXTERNAL_EVENT_HOOK_METADATA,
        redisConf,
        controllers[0].metatype,
      );
      discoveryServiceMock.getControllers.mockReturnValue(controllers);

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
      await expect(handlerSpy).toHaveBeenCalledWith([123]);
    });
  });
});
