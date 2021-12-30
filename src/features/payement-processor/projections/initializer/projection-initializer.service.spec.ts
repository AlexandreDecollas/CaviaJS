import { Test, TestingModule } from '@nestjs/testing';
import { ProjectionInitializerService } from './projection-initializer.service';
import { ProjectionUpserterService } from '../../../../eventstore-connector/projection-upserter/projection-upserter.service';

describe('ProjectionInitializerService', () => {
  let service: ProjectionInitializerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectionInitializerService,
        {
          provide: ProjectionUpserterService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProjectionInitializerService>(
      ProjectionInitializerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
