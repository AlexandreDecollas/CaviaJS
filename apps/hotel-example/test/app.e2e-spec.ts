import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { setTimeout } from 'timers/promises';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const roomNumber: number = Math.floor(Math.random() * 200);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`should be able to reserve a room when name is bibap aloula and room is ${roomNumber}`, async () => {
    await request(app.getHttpServer()).get('/register/bibap/aloula');
    await request(app.getHttpServer()).get('/add-room/' + roomNumber);
    await setTimeout(500);

    return request(app.getHttpServer())
      .get('/book-room/check-availability/' + roomNumber)
      .expect(404);
  });
});
