import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { EventMoment } from 'src/@core/domain/event/entity/event-moment.entity';
import { EventEntity } from 'src/@core/domain/event/entity/event.entity';
import {
  makeTestPrismaClient,
  removeTestPrismaClient,
} from 'test/@shared/utils/prisma/db-connection.util';
import { PrismaEventRepository } from './prisma-event.repository';

describe('PrismaEventRepository test', () => {
  let prisma: PrismaClient;

  let repository: PrismaEventRepository;

  async function createSongTest() {
    return await prisma.songs.create({
      data: {
        title: 'song title',
        artists: 'artist',
        lyricPreview: 'lyric',
        externalProvider: 'provider',
        externalProviderSongId: randomUUID(),
      },
    });
  }

  async function createRepertoireTest() {
    const song = await createSongTest();
    return await prisma.repertoire.create({
      data: {
        id: randomUUID(),
        title: 'title',
        description: 'description',
        RepertoireSongs: {
          create: [
            {
              id: randomUUID(),
              label: 'label',
              lyrics: 'lyrics',
              title: 'title',
              youtubeLink: 'youtubeLink',
              song: {
                connect: {
                  id: song.id,
                },
              },
            },
          ],
        },
      },
    });
  }

  async function createUserTest() {
    return await prisma.users.create({
      data: {
        email: `email${randomUUID()}@test.com`,
        name: 'name',
      },
    });
  }

  beforeAll(async () => {
    prisma = await makeTestPrismaClient();
    repository = new PrismaEventRepository(prisma);
  });

  afterAll(async () => {
    await removeTestPrismaClient();
  });

  it('should create an event without moments', async () => {
    const id = randomUUID();
    const user = await createUserTest();
    const event = new EventEntity({
      id: id,
      title: 'title',
      description: 'description',
      startDate: new Date(),
      endDate: new Date(),
      ownerId: user.id,
    });

    await repository.create(event);

    const result = await prisma.events.findUnique({ where: { id: id } });

    expect(result).toStrictEqual({
      id: id,
      title: 'title',
      description: 'description',
      startDate: expect.any(Date),
      endDate: expect.any(Date),
      ownerId: user.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should create an event with moments', async () => {
    const id = randomUUID();
    const user = await createUserTest();
    const repertoire = await createRepertoireTest();
    const eventMoment1 = new EventMoment({
      title: 'title',
      repertoireId: repertoire.id,
    });
    const eventMoment2 = new EventMoment({
      title: 'title2',
    });
    const event = new EventEntity({
      id: id,
      title: 'title',
      description: 'description',
      startDate: new Date(),
      endDate: new Date(),
      ownerId: user.id,
      moments: [eventMoment1, eventMoment2],
    });

    await repository.create(event);

    const result = await prisma.events.findUnique({
      where: { id: id },
      include: {
        eventMoments: {
          include: {
            Repertoire: true,
            EventMomentMembers: true,
          },
        },
      },
    });

    expect(result.id).toBe(id);
    expect(result.eventMoments).toHaveLength(2);
    result.eventMoments.forEach((moment) => {
      expect(
        [eventMoment1.id, eventMoment2.id].includes(moment.id),
      ).toBeTruthy();
      if (moment.id === eventMoment1.id) {
        expect(moment.Repertoire.id).toBe(repertoire.id);
      }
    });
  });

  it('should find an event by id', async () => {
    const id = randomUUID();
    const user = await createUserTest();
    const repertoire = await createRepertoireTest();
    const eventMoment1 = new EventMoment({
      title: 'title',
      repertoireId: repertoire.id,
    });
    const eventMoment2 = new EventMoment({
      title: 'title2',
    });
    const event = new EventEntity({
      id: id,
      title: 'title',
      description: 'description',
      startDate: new Date(),
      endDate: new Date(),
      ownerId: user.id,
      moments: [eventMoment1, eventMoment2],
    });

    await prisma.events.create({
      data: {
        id: id,
        title: 'title',
        description: 'description',
        startDate: new Date(),
        endDate: new Date(),
        ownerId: user.id,
        eventMoments: {
          create: [
            {
              id: eventMoment1.id,
              title: eventMoment1.title,
              Repertoire: {
                connect: {
                  id: repertoire.id,
                },
              },
            },
            {
              id: eventMoment2.id,
              title: eventMoment2.title,
            },
          ],
        },
      },
    });

    const result = await repository.findById(event.id);

    expect(result).toBeInstanceOf(EventEntity);
    expect(result.id).toBe(event.id);
    expect(result.moments).toHaveLength(2);
    result.moments.forEach((moment) => {
      expect(
        [eventMoment1.id, eventMoment2.id].includes(moment.id),
      ).toBeTruthy();
      if (moment.id === eventMoment1.id) {
        expect(moment.repertoireId).toBe(repertoire.id);
      }
    });
  });

  it('should return null when event is not found', async () => {
    const result = await repository.findById(randomUUID());

    expect(result).toBeNull();
  });
});
