import { Test, TestingModule } from '@nestjs/testing';
import { AddRoomController } from './add-room.controller';

describe('AddRoomController', () => {
  let controller: AddRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddRoomController],
    }).compile();

    controller = module.get<AddRoomController>(AddRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
