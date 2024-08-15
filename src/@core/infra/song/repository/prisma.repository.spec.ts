import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { Song } from 'src/@core/domain/song/entity/song.entity';
import { makeTestPrismaClient } from 'test/@shared/utils/prisma.util';
import { PrismaSongRepository } from './prisma.repository';

describe('PrismaSongRepository', () => {
  let prisma: PrismaClient;

  let repository: PrismaSongRepository;

  beforeAll(async () => {
    prisma = await makeTestPrismaClient('file:./testing.db');
    repository = new PrismaSongRepository(prisma);
    await prisma.songs.deleteMany();
  });

  it('should create a song', async () => {
    const id = randomUUID();
    const song = new Song({
      id: id,
      title: 'title',
      artists: ['artist'],
      lyricPreview: 'lyric',
      thumbnailLink: 'https://thumbnail.com',
      source: {
        provider: 'provider',
        providerSongId: id,
      },
    });

    await repository.create(song);

    const result = await prisma.songs.findUnique({ where: { id: id } });

    expect(result).toStrictEqual({
      id: id,
      title: 'title',
      artists: 'artist',
      lyricPreview: 'lyric',
      thumbnailLink: 'https://thumbnail.com',
      externalProvider: 'provider',
      externalProviderSongId: id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should find a song by id', async () => {
    const id = randomUUID();
    await prisma.songs.create({
      data: {
        id: id,
        title: 'title',
        artists: 'artist',
        lyricPreview: 'lyric',
        thumbnailLink: 'https://thumbnail.com',
        externalProvider: 'provider',
        externalProviderSongId: id,
      },
    });

    const result = await repository.findById(id);

    expect(result).toStrictEqual(
      new Song({
        id: id,
        title: 'title',
        artists: ['artist'],
        lyricPreview: 'lyric',
        thumbnailLink: 'https://thumbnail.com',
        source: {
          provider: 'provider',
          providerSongId: id,
        },
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      }),
    );
  });

  it('should return null when song is not found', async () => {
    const result = await repository.findById(randomUUID());

    expect(result).toBeNull();
  });
});
