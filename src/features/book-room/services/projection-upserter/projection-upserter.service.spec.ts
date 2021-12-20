import { Test, TestingModule } from '@nestjs/testing';
import { ProjectionUpserterService } from './projection-upserter.service';
import { ConnectionInitializerService } from '../../../../eventstore-connector/connection-initializer/connection-initializer.service';

describe('ProjectionUpserterService', () => {
  let service: ProjectionUpserterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectionUpserterService, ConnectionInitializerService],
    }).compile();

    service = module.get<ProjectionUpserterService>(ProjectionUpserterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
