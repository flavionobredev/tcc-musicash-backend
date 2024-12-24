import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from 'src/@core/application/service';
import { CreateDefaultEventUsecase } from 'src/@core/application/usecase';
import {
  PrismaEventRepository,
  PrismaRepertoireRepository,
  PrismaUserRepository,
} from 'src/@core/infra/repositories';
import { DbPrismaClient } from 'src/infra/database/prisma';
import { createAppConfig } from 'src/main/factories/configure-app';
import { AuthModule } from 'src/modules/auth/auth.module';
import { EventsController } from 'src/modules/events/controllers';
import * as request from 'supertest';
import { makeTestPrismaClient, removeTestPrismaClient } from 'test/@shared/utils/prisma/db-connection.util';

describe('EventController (e2e): create default event', () => {
  let app: INestApplication;
  let prisma: DbPrismaClient;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [EventsController],
      providers: [
        {
          provide: DbPrismaClient,
          useFactory: () => {
            return makeTestPrismaClient();
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
    const user = await prisma.users.create({
      data: {
        name: 'Teste',
        email: 'testeteste@teste.com',
      },
    });
    token = await moduleFixture.get<TokenService>(TokenService).signAsync(
      {},
      {
        subject: user.id,
        audience: 'musicash.app',
        issuer: 'musicash.app',
        expiresIn: '4h',
      },
    );
    await app.init();
  });

  afterAll(async () => {
    await removeTestPrismaClient();
    await app.close();
  });

  it('/events (POST): should throw error if user not authenticated', () => {
    return request(app.getHttpServer())
      .post('/api/events')
      .send({
        title: 'Event title',
        startDate: new Date().toISOString(),
      })
      .expect(401)
      .expect({
        message: 'Invalid Token',
        error: 'InvalidAppTokenException',
      });
  });

  it('/events (POST): should throw error if user not found', () => {
    return request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
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
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
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
        email: 'teste@teste.com',
        name: 'Teste',
      },
    });

    return request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
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
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
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
