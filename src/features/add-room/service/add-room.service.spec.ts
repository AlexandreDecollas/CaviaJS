import { Test, TestingModule } from '@nestjs/testing';
import { AddRoomService } from './add-room.service';

describe('AddRoomService', () => {
  let service: AddRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddRoomService],
    }).compile();

    service = module.get<AddRoomService>(AddRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
