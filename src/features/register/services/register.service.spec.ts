import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterService, EventEmitter2, IdGeneratorService],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
