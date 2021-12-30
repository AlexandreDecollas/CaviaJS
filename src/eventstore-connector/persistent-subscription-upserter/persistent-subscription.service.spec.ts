import { Test, TestingModule } from '@nestjs/testing';
import { PersistentSubscriptionService } from './persistent-subscription.service';

describe('PersistentSubscriptionService', () => {
  let service: PersistentSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersistentSubscriptionService],
    }).compile();

    service = module.get<PersistentSubscriptionService>(
      PersistentSubscriptionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
