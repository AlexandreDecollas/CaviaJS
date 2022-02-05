import {
  ESDBConnectionService,
  Eventbus,
  fetchConnectedPersistentSubscriptions,
  fetchProvidedPersistentSubscriptionsConfigurations,
  INTERNAL_EVENTS_QUEUE_CONFIGURATION,
} from 'cavia-js';
import { Logger } from '@nestjs/common';
import * as BullMQ from 'bullmq';
import { Test, TestingModule } from '@nestjs/testing';
import spyOn = jest.spyOn;

describe('Eventbus', () => {
  let service: Eventbus;

  function getDefaultRedisQueueConf() {
    return {
      queueName: 'tutu',
      options: {
        connection: {
          host: '',
          port: 1234,
        },
      },
    } as any;
  }

  let redisQueueConfMock;
  const connectionMock = {
    getConnectedClient: jest.fn(),
  } as any;
  const loggerMock = { debug: jest.fn() } as any;
  spyOn(BullMQ, 'Worker').mockImplementation(() => null);

  async function initService(): Promise<Eventbus> {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Eventbus,
        {
          provide: INTERNAL_EVENTS_QUEUE_CONFIGURATION,
          useValue: redisQueueConfMock,
        },
        {
          provide: ESDBConnectionService,
          useValue: connectionMock,
        },
        {
          provide: Logger,
          useValue: loggerMock,
        },
      ],
    }).compile();
    return module.get<Eventbus>(Eventbus);
  }

  beforeEach(async () => {
    spyOn(console, 'warn');

    redisQueueConfMock = getDefaultRedisQueueConf();
    service = await initService();

    const persubs = fetchProvidedPersistentSubscriptionsConfigurations();
    Object.keys(persubs).forEach((key: string) => delete persubs[key]);

    const connectedPersubs = fetchConnectedPersistentSubscriptions();
    Object.keys(connectedPersubs).forEach(
      (key: string) => delete connectedPersubs[key],
    );
    jest.resetAllMocks();
  });

  it('should not init internal redis queue conf when no conf provided at startup', async () => {
    redisQueueConfMock = null;
    jest.resetAllMocks();
    spyOn(BullMQ, 'Worker').mockImplementation(() => null);
    service = await initService();

    await service.onApplicationBootstrap();

    expect(BullMQ.Worker).not.toHaveBeenCalled();
  });

  it('should listen on events from internal redis queue at module startup', async () => {
    await service.onApplicationBootstrap();

    expect(BullMQ.Worker).toHaveBeenCalledWith(
      'tutu',
      expect.any(Function),
      redisQueueConfMock.options,
    );
  });

  it('should append to eventstore events when spotted on external eventbus', async () => {
    await service.onApplicationBootstrap();
    const handler = BullMQ.Worker['mock'].calls[0][1];
    const appendToStreamSpy = jest.fn();
    connectionMock.getConnectedClient.mockReturnValue({
      appendToStream: appendToStreamSpy,
    });

    await handler({ data: { metadata: { streamName: 'toto' } } });

    expect(appendToStreamSpy).toHaveBeenCalledWith('toto', {
      metadata: { streamName: 'toto' },
    });
  });

  it('should push to redis when a conf is provided while event is emitted', async () => {
    const addEventSpy = jest.fn();
    spyOn(BullMQ, 'Queue').mockReturnValue({ add: addEventSpy } as any);

    await service.emit({
      data: { toto: 123 },
      metadata: { streamName: 'plpl' },
      type: 'ff',
    });

    expect(BullMQ.Queue).toHaveBeenCalledWith(
      'tutu',
      redisQueueConfMock.options,
    );
    expect(addEventSpy).toHaveBeenCalled();
  });

  it('should push directly to eventstore when no redis conf is provided while event is emitted', async () => {
    redisQueueConfMock = null;
    jest.resetAllMocks();
    service = await initService();
    const appendToStreamSpy = jest.fn();
    connectionMock.getConnectedClient.mockReturnValue({
      appendToStream: appendToStreamSpy,
    });

    await service.emit({
      data: { toto: 123 },
      metadata: { streamName: 'okok' },
      type: 'ff',
    });

    expect(appendToStreamSpy).toHaveBeenCalledWith('okok', expect.anything());
    expect(appendToStreamSpy.mock.calls[0][1].type).toEqual('ff');
  });
});
