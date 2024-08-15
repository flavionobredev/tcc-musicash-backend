import { PrismaClient } from '@prisma/client';
import { RepertoireSong } from 'src/@core/domain/repertoire/entity/repertoire-song.entity';
import { Repertoire } from 'src/@core/domain/repertoire/entity/repertoire.entity';
import { RepertoireRepository } from 'src/@core/domain/repertoire/repository/repertoire.repository';

export class PrismaRepertoireRepository implements RepertoireRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(entity: Repertoire): Promise<void> {
    await this.prisma.repertoire.create({
      data: {
        id: entity.id,
        title: entity.title,
        description: entity.description,
        RepertoireSongs: {
          create: entity.songs.map((repertoireSong) => ({
            id: repertoireSong.id,
            label: repertoireSong.label,
            lyrics: repertoireSong.lyrics,
            title: repertoireSong.title,
            youtubeLink: repertoireSong.youtubeLink,
            song: {
              connect: {
                id: repertoireSong.songId,
              },
            },
          })),
        },
      },
    });
  }
  async findById(id: string): Promise<Repertoire> {
    const result = await this.prisma.repertoire.findUnique({
      where: { id },
      include: { RepertoireSongs: true },
    });
    if (!result) return null;
    const repertoire = new Repertoire({
      id: result.id,
      title: result.title,
      description: result.description,
    });

    result.RepertoireSongs.forEach((repertoireSong) => {
      repertoire.addSong(
        new RepertoireSong({
          id: repertoireSong.id,
          label: repertoireSong.label,
          lyrics: repertoireSong.lyrics,
          youtubeLink: repertoireSong.youtubeLink,
          songId: repertoireSong.songId,
          title: repertoireSong.title,
        }),
      );
    });

    return repertoire;
  }
}
