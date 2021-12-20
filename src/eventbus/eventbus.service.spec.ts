import { Test, TestingModule } from '@nestjs/testing';
import { EventbusService } from './eventbus.service';
import { ConnectionInitializerService } from '../eventstore-connector/connection-initializer/connection-initializer.service';

describe('EventbusService', () => {
  let service: EventbusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventbusService, ConnectionInitializerService],
    }).compile();

    service = module.get<EventbusService>(EventbusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
