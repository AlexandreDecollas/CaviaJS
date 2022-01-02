import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryFifoService } from './in-memory-fifo.service';

describe('InMemoryFifoService', () => {
  let service: InMemoryFifoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMemoryFifoService],
    }).compile();

    service = module.get<InMemoryFifoService>(InMemoryFifoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
