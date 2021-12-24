import { Test, TestingModule } from '@nestjs/testing';
import { PayementRequestedController } from './payement-requested.controller';
import { PayementRequestedService } from '../services/payement-requested.service';

describe('PayementRequestedController', () => {
  let controller: PayementRequestedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayementRequestedController],
      providers: [
        {
          provide: PayementRequestedService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PayementRequestedController>(
      PayementRequestedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
