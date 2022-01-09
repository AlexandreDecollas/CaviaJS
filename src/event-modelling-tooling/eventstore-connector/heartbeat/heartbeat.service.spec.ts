import { Test, TestingModule } from '@nestjs/testing';
import { HeartbeatService } from './heartbeat.service';
import { ESDBConnectionService } from '../connection-initializer/esdb-connection.service';
import { Logger } from '@nestjs/common';
import { HEARTBEAT_INTERVAL } from '../../constants';

describe('HeartbeatService', () => {
  let service: HeartbeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeartbeatService,
        {
          provide: ESDBConnectionService,
          useValue: {},
        },
        {
          provide: Logger,
          useValue: {},
        },
        {
          provide: HEARTBEAT_INTERVAL,
          useValue: 10_000,
        },
      ],
    }).compile();

    service = module.get<HeartbeatService>(HeartbeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
