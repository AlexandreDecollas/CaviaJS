import { Test, TestingModule } from '@nestjs/testing';
import {
  ESDBConnectionService,
  HEARTBEAT_INTERVAL,
  HeartbeatService,
} from 'cavia-js';
import { Logger } from '@nestjs/common';

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
