import { Test, TestingModule } from '@nestjs/testing';
import { PersistentSubscriptionInitializerService } from './persistent-subscription-initializer.service';
import { PersistentSubscriptionService } from '../../../../eventstore-connector/persistent-subscription-upserter/persistent-subscription.service';
import { IdGeneratorService } from '../../../../utils/id-generator/id-generator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
          provide: EventEmitter2,
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
