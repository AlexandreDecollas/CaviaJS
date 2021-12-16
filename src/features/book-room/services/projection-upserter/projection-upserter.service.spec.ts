import { Test, TestingModule } from '@nestjs/testing';
import { ProjectionUpserterService } from './projection-upserter.service';

describe('ProjectionUpserterService', () => {
  let service: ProjectionUpserterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectionUpserterService],
    }).compile();

    service = module.get<ProjectionUpserterService>(ProjectionUpserterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
