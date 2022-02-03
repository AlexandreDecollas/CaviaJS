import { Test, TestingModule } from '@nestjs/testing';
import { CaviaJsService } from './cavia-js.service';

describe('CaviaJsService', () => {
  let service: CaviaJsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaviaJsService],
    }).compile();

    service = module.get<CaviaJsService>(CaviaJsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
