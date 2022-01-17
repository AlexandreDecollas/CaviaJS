import { Test, TestingModule } from '@nestjs/testing';
import * as BullMQ from 'bullmq';
import { DiscoveryService } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import {
  fetchConnectedPersistentSubscriptions,
  fetchProvidedPersistentSubscriptionsConfigurations,
  provideConnectedPersistentSubscription,
} from '../../eventstore-connector/persistent-subscription/provider/persistent-suscriptions.provider';
import { PersubEventHook } from '../../command-decorators/method-decorator/persub-event-hook.decorator';
import {
  EXTERNAL_EVENT_HOOK_METADATA,
  PERSUB_HOOK_METADATA,
} from '../../constants';
import { PARK } from '@eventstore/db-client';
import { ExternalEventHook } from '../../command-decorators/method-decorator/external-event-hook.decorator';
import { RedisQueueConfiguration } from '../../event-modelling.configuration';
import spyOn = jest.spyOn;
import { ExternalEventbusStarterService } from './external-eventbus-starter.service';

describe('EventbusStarterService', () => {
  let service: ExternalEventbusStarterService;

  const discoveryServiceMock = {
    getControllers: jest.fn(),
  } as any;
  const loggerMock = { debug: jest.fn() } as any;
  spyOn(BullMQ, 'Worker').mockImplementation(() => null);

  beforeEach(async () => {
    spyOn(console, 'warn');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalEventbusStarterService,
        {
          provide: DiscoveryService,
          useValue: discoveryServiceMock,
        },
        {
          provide: Logger,
          useValue: loggerMock,
        },
      ],
    }).compile();
    service = module.get<ExternalEventbusStarterService>(
      ExternalEventbusStarterService,
    );

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
