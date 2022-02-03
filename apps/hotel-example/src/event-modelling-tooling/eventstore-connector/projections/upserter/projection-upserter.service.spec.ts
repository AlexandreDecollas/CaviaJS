import { Test, TestingModule } from '@nestjs/testing';
import { ProjectionUpserterService } from './projection-upserter.service';
import { ESDBConnectionService } from '../../connection-initializer/esdb-connection.service';
import { Logger } from '@nestjs/common';
import { Projection, provideProjection } from '../provider/projection.provider';

describe('ProjectionUpserterService', () => {
  let service: ProjectionUpserterService;

  const updateProjectionSpy = jest.fn();
  const createProjectionSpy = jest.fn();

  const projection: Projection = {
    name: 'test',
    content: '[...]..emit(..[...]',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectionUpserterService,
        {
          provide: ESDBConnectionService,
          useValue: {
            getConnectedClient: () => {
              return {
                updateProjection: updateProjectionSpy,
                createContinuousProjection: createProjectionSpy,
              };
            },
          },
        },
        {
          provide: Logger,
          useValue: { log: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ProjectionUpserterService>(ProjectionUpserterService);

    provideProjection(projection);
  });

  it('should assume the projection exists and update it at init', async () => {
    updateProjectionSpy.mockResolvedValueOnce(null);

    await service.onModuleInit();

    expect(updateProjectionSpy).toHaveBeenCalledWith(
      projection.name,
      projection.content,
      expect.anything(),
    );
  });

  it('should try to create the projection when the update failed, assuming it did not exist', async () => {
    updateProjectionSpy.mockImplementationOnce(() => {
      throw Error();
    });

    await service.onModuleInit();

    expect(createProjectionSpy).toHaveBeenCalled();
  });

  it('should upsert each provided projections', async () => {
    provideProjection({
      name: 'test2',
      content: '',
    });
    provideProjection({
      name: 'test3',
      content: '',
    });
    updateProjectionSpy.mockResolvedValueOnce(null);

    await service.onModuleInit();

    expect(updateProjectionSpy).toHaveBeenCalledTimes(3);
  });

  it('should specify to track emitted streams when the projection owns a amit instruction', async () => {
    updateProjectionSpy.mockResolvedValueOnce(null);

    await service.onModuleInit();

    expect(updateProjectionSpy).toHaveBeenCalledWith(
      projection.name,
      projection.content,
      { trackEmittedStreams: true },
    );
  });
});
