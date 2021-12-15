import { Test, TestingModule } from '@nestjs/testing';
import { EventbusService } from './eventbus.service';

describe('EventbusService', () => {
  let service: EventbusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventbusService],
    }).compile();

    service = module.get<EventbusService>(EventbusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
