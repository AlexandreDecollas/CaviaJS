import { Test, TestingModule } from '@nestjs/testing';
import { ProjectionUpserterService } from './projection-upserter.service';
import { ESDBConnectionService } from '../../connection-initializer/esdb-connection.service';
import { Logger } from '@nestjs/common';

describe('ProjectionUpserterService', () => {
  let service: ProjectionUpserterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectionUpserterService,
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

    service = module.get<ProjectionUpserterService>(ProjectionUpserterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
