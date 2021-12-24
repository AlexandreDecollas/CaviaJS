import { Test, TestingModule } from '@nestjs/testing';
import { CheckOutController } from './check-out.controller';
import { CheckOutService } from '../services/check-out.service';

describe('CheckOutController', () => {
  let controller: CheckOutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckOutController],
      providers: [
        {
          provide: CheckOutService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CheckOutController>(CheckOutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
