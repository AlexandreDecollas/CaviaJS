import { Test, TestingModule } from '@nestjs/testing';
import { PersistentSubscriptionInitializerService } from './persistent-subscription-initializer.service';

describe('PersistentSubscriptionInitializerService', () => {
  let service: PersistentSubscriptionInitializerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersistentSubscriptionInitializerService],
    }).compile();

    service = module.get<PersistentSubscriptionInitializerService>(
      PersistentSubscriptionInitializerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
