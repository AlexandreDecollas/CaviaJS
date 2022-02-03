import { Test, TestingModule } from '@nestjs/testing';
import { PersistentSubscriptionService } from 'cavia-js';

describe('PersistentSubscriptionService', () => {
  let service: PersistentSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersistentSubscriptionService,
        {
          provide: PersistentSubscriptionService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PersistentSubscriptionService>(
      PersistentSubscriptionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
