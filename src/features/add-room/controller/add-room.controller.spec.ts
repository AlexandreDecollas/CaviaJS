import { Test, TestingModule } from '@nestjs/testing';
import { AddRoomController } from './add-room.controller';
import { AddRoomService } from '../service/add-room.service';

describe('AddRoomController', () => {
  let controller: AddRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddRoomController],
      providers: [
        {
          provide: AddRoomService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AddRoomController>(AddRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
