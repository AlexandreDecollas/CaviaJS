import { Test, TestingModule } from '@nestjs/testing';
import { Eventbus } from './eventbus.service';
import { ESDBConnectionService } from '../eventstore-connector/connection-initializer/esdb-connection.service';

describe('EventbusService', () => {
  let service: Eventbus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Eventbus,
          useValue: {},
        },
        ESDBConnectionService,
      ],
    }).compile();

    service = module.get<Eventbus>(Eventbus);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
