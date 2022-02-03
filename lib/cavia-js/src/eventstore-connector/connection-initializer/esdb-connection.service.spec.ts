import { Test, TestingModule } from '@nestjs/testing';
import { ESDBConnectionService } from 'cavia-js';
import { Logger } from '@nestjs/common';

describe('ESDBConnectionService', () => {
  let service: ESDBConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ESDBConnectionService,
          useValue: {},
        },
        {
          provide: Logger,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ESDBConnectionService>(ESDBConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
