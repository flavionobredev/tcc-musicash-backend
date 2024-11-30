import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateDefaultEventUsecase } from 'src/@core/application/usecase';
import { PrismaEventRepository } from 'src/@core/infra/event/repository/prisma.repository';
import { PrismaRepertoireRepository } from 'src/@core/infra/repertoire/repository/prisma.repository';
import { PrismaUserRepository } from 'src/@core/infra/user/repository/prisma.repository';
import { DbPrismaClient } from 'src/infra/database/prisma';
import { createAppConfig } from 'src/main/factories/configure-app';
import { EventsController } from 'src/modules/events/controllers';
import * as request from 'supertest';
import {
  makeTestPrismaClient,
  removeTestPrismaClient,
} from 'test/@shared/utils/prisma/db-connection.util';

describe('EventController (e2e): create default event', () => {
  let app: INestApplication;
  let prisma: DbPrismaClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: DbPrismaClient,
          useFactory: () => {
            return makeTestPrismaClient('testinge2e.db');
          },
        },
        {
          provide: CreateDefaultEventUsecase,
          useFactory: (prisma) => {
            return new CreateDefaultEventUsecase(
              new PrismaRepertoireRepository(prisma),
              new PrismaEventRepository(prisma),
              new PrismaUserRepository(prisma),
            );
          },
          inject: [DbPrismaClient],
        },
      ],
    }).compile();

    app = createAppConfig(moduleFixture.createNestApplication());
    prisma = moduleFixture.get<DbPrismaClient>(DbPrismaClient);
    await app.init();
  });

  afterAll(async () => {
    await removeTestPrismaClient('testinge2e.db');
    await app.close();
  });

  it('/events (POST): should throw error if user not found', () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({
        title: 'Event title',
        startDate: new Date().toISOString(),
      })
      .expect(404)
      .expect({
        message: 'User not found',
        error: 'UserNotFoundException',
      });
  });

  it('/events (POST): should throw error if date is invalid', () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({
        title: 'Event title',
        startDate: new Date().toISOString() + 'hehe',
      })
      .expect(422)
      .expect({
        message: [
          'startDate must be a valid date',
          'startDate must be a Date instance',
        ],
        error: 'Unprocessable Entity',
        statusCode: 422,
      });
  });

  it('/events (POST): should throw error if invalid body is sended', async () => {
    await prisma.users.create({
      data: {
        id: 'cec2009f-d703-4606-a8b7-240efe21ea37',
      },
    });

    return request(app.getHttpServer())
      .post('/events')
      .send({
        title: '',
        startDate: null,
        endDate: '2021-10-10',
        description: true,
      })
      .expect((result) => {
        expect(result.status).toBe(422);
        expect(result.body.message).toEqual([
          'title should not be empty',
          'startDate must be a valid date',
          'endDate must be a valid date',
        ]);
      });
  });

  it('/events (POST): should create event with default values', async () => {
    const now = new Date().toISOString();
    return request(app.getHttpServer())
      .post('/events')
      .send({
        title: 'Event title',
        startDate: now,
      })
      .expect(201)
      .expect({
        title: 'Event title',
        ownerId: 'cec2009f-d703-4606-a8b7-240efe21ea37',
        startDate: now,
      });
  });
});
