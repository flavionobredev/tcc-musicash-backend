import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { RepertoireSong } from 'src/@core/domain/repertoire/entity/repertoire-song.entity';
import { Repertoire } from 'src/@core/domain/repertoire/entity/repertoire.entity';
import { makeTestPrismaClient } from 'test/@shared/utils/prisma/db-connection.util';
import { PrismaRepertoireRepository } from './prisma.repository';

describe('PrismaRepertoireRepository', () => {
  let prisma: PrismaClient;

  let repository: PrismaRepertoireRepository;

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

  beforeAll(async () => {
    prisma = await makeTestPrismaClient('testing.db');
    repository = new PrismaRepertoireRepository(prisma);
    await prisma.repertoire.deleteMany();
    await prisma.repertoireSongs.deleteMany();
    await prisma.songs.deleteMany();
  });

  it('should create a repertoire without songs', async () => {
    const id = randomUUID();
    const repertoire = new Repertoire({
      id: id,
      title: 'title',
      description: 'description',
    });

    await repository.create(repertoire);

    const result = await prisma.repertoire.findUnique({ where: { id: id } });

    expect(result).toStrictEqual({
      id: id,
      title: 'title',
      description: 'description',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should create a repertoire with songs', async () => {
    const id = randomUUID();
    const song = await createSongTest();
    const repertoire = new Repertoire({
      id: id,
      title: 'title',
      description: 'description',
    });

    const repertoireSong = new RepertoireSong({
      title: 'title',
      lyrics: 'lyric',
      songId: song.id,
      label: 'label',
      youtubeLink: 'https://youtube.com',
    });

    repertoire.addSong(repertoireSong);

    await repository.create(repertoire);

    const result = await prisma.repertoire.findUnique({
      where: { id: id },
      include: { RepertoireSongs: true },
    });

    expect(result).toStrictEqual({
      id: repertoire.id,
      title: repertoire.title,
      RepertoireSongs: expect.any(Array),
      description: repertoire.description,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(result.RepertoireSongs[0]).toStrictEqual({
      id: repertoireSong.id,
      title: repertoireSong.title,
      label: repertoireSong.label,
      lyrics: repertoireSong.lyrics,
      youtubeLink: repertoireSong.youtubeLink,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      songId: song.id,
      repertoireId: repertoire.id,
    });
  });

  it('should find a repertoire by id', async () => {
    const id = randomUUID();
    const repertoireSongId = randomUUID();
    const song = await createSongTest();
    await prisma.repertoire.create({
      data: {
        id: id,
        title: 'title',
        description: 'description',
        RepertoireSongs: {
          create: {
            id: repertoireSongId,
            title: 'title',
            lyrics: 'lyrics',
            song: {
              connect: {
                id: song.id,
              },
            },
          },
        },
      },
    });

    const result = await repository.findById(id);

    expect(result).toBeInstanceOf(Repertoire);
    expect(result).toHaveProperty('id', id);
    expect(result.songs[0]).toHaveProperty('id', repertoireSongId);
  });

  it('should return null if repertoire is not found', async () => {
    const result = await repository.findById(randomUUID());

    expect(result).toBeNull();
  });
});
