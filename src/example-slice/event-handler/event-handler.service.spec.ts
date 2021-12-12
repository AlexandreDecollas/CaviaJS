import { Test, TestingModule } from '@nestjs/testing';
import { EventHandlerService } from './event-handler.service';

describe('EventHandlerService', () => {
  let service: EventHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventHandlerService],
    }).compile();

    service = module.get<EventHandlerService>(EventHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
