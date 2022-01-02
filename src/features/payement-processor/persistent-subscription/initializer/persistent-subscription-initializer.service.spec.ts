import { Test, TestingModule } from '@nestjs/testing';
import { PersistentSubscriptionInitializerService } from './persistent-subscription-initializer.service';
import { IdGeneratorService } from '../../../../utils/id-generator/id-generator.service';
import { PersistentSubscriptionService } from '../../../../eventstore-connector/persistent-subscription/upserter/persistent-subscription.service';
import { Eventbus } from '../../../../eventbus/eventbus.service';

describe('PersistentSubscriptionInitializerService', () => {
  let service: PersistentSubscriptionInitializerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersistentSubscriptionInitializerService,
        {
          provide: PersistentSubscriptionService,
          useValue: {},
        },
        {
          provide: IdGeneratorService,
          useValue: {},
        },
        {
          provide: Eventbus,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PersistentSubscriptionInitializerService>(
      PersistentSubscriptionInitializerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
