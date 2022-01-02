import { Test, TestingModule } from '@nestjs/testing';
import { ESDBConnectionService } from './esdb-connection.service';

describe('ESDBConnectionService', () => {
  let service: ESDBConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ESDBConnectionService],
    }).compile();

    service = module.get<ESDBConnectionService>(ESDBConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
