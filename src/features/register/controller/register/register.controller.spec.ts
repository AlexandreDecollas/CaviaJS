import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RegisterService } from '../../services/register.service';

describe('RegisterController', () => {
  let controller: RegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        {
          provide: RegisterService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
