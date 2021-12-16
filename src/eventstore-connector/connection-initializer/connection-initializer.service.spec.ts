import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionInitializerService } from './connection-initializer.service';

describe('ConnectionInitializerService', () => {
  let service: ConnectionInitializerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionInitializerService],
    }).compile();

    service = module.get<ConnectionInitializerService>(
      ConnectionInitializerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
