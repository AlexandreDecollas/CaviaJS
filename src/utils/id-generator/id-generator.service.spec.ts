import { Test, TestingModule } from '@nestjs/testing';
import { IdGeneratorService } from './id-generator.service';

describe('IdGeneratorService', () => {
  let service: IdGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdGeneratorService],
    }).compile();

    service = module.get<IdGeneratorService>(IdGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
