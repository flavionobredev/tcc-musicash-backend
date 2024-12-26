import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateDefaultEventUsecase } from 'src/@core/application/usecase';
import {
  PrismaEventRepository,
  PrismaRepertoireRepository,
  PrismaUserRepository,
} from 'src/@core/infra/repositories';
import { DatabaseModule } from 'src/infra/database/database.module';
import { DbPrismaClient } from 'src/infra/database/prisma';
import { createAppConfig } from 'src/main/factories/configure-app';
import { AuthModule } from 'src/modules/auth/auth.module';
import { EventsController } from 'src/modules/events/controllers';
import * as request from 'supertest';
import { FirebaseAuth } from 'test/@shared/utils/firebase/auth';
import {
  makeTestPrismaClient,
  removeTestPrismaClient,
} from 'test/@shared/utils/prisma/db-connection.util';

describe('EventController (e2e): create default event', () => {
  let app: INestApplication;
  let prisma: DbPrismaClient;
  const firebaseAuth = new FirebaseAuth(
    process.env.GOOGLE_FIREBASE_TEST_API_KEY,
  );
  let user: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, DatabaseModule],
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
    await app.init();
    await firebaseAuth.initWithUser();
    user = await prisma.users.create({
      data: {
        name: 'Teste',
        email: firebaseAuth.getUsername(),
      },
    });
  });

  afterAll(async () => {
    await removeTestPrismaClient();
    await firebaseAuth.removeUser();
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

  it('/events (POST): should throw error if user not found', async () => {
    const invalid = new FirebaseAuth(process.env.GOOGLE_FIREBASE_TEST_API_KEY);
    await invalid.initWithUser();
    await request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${invalid.getToken()}`)
      .send({
        title: 'Event title',
        startDate: new Date().toISOString(),
      })
      .expect(401)
      .expect({
        message: 'Invalid user for token',
        error: 'InvalidUserForTokenException',
      });
    return await invalid.removeUser();
  });

  it('/events (POST): should throw error if date is invalid', () => {
    return request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${firebaseAuth.getToken()}`)
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
    return request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${firebaseAuth.getToken()}`)
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
      .set('Authorization', `Bearer ${firebaseAuth.getToken()}`)
      .send({
        title: 'Event title',
        startDate: now,
      })
      .expect(201)
      .expect({
        title: 'Event title',
        ownerId: user.id,
        startDate: now,
      });
  });
});
