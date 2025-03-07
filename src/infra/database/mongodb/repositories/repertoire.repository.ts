import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { RepertoireSong } from 'src/@core/domain/repertoire/entity/repertoire-song.entity';
import { Repertoire } from 'src/@core/domain/repertoire/entity/repertoire.entity';
import { RepertoireRepository } from 'src/@core/domain/repertoire/repository/repertoire.repository';
import { MongoModelsName } from '../models.enum';
import { RepertoireSchemaType, RepertoireSongSchemaType } from '../schemas';

export class MongoDBRepertoireRepository implements RepertoireRepository {
  constructor(
    @Inject(MongoModelsName.Repertoires)
    private readonly repertoireModel: Model<RepertoireSchemaType>,
    @Inject(MongoModelsName.RepertoireSongs)
    private readonly repertoireSongModel: Model<RepertoireSongSchemaType>,
  ) {}

  async create(entity: Repertoire) {
    const session = await this.repertoireModel.db.startSession();

    await session.withTransaction(async () => {
      for (const repertoireSong of entity.songs) {
        await this.repertoireSongModel.create({
          _id: repertoireSong.id,
          title: repertoireSong.title,
          lyrics: repertoireSong.lyrics,
          label: repertoireSong.label,
          youtube_link: repertoireSong.youtubeLink,
          repertoire: entity.id,
          song: repertoireSong.songId,
        });
      }

      await this.repertoireModel.create({
        _id: entity.id,
        title: entity.title,
        description: entity.description,
        songs: entity.songs.map((song) => song.id),
      });
    });

    await session.endSession();
  }

  async findById(id: string): Promise<Repertoire> {
    const result = await this.repertoireModel.findById(id).populate('songs');
    if (!result) return null;

    const repertoire = new Repertoire({
      id: result._id.toHexString(),
      title: result.title,
      description: result.description,
    });

    result.songs.forEach((repertoireSong: RepertoireSongSchemaType) => {
      repertoire.addSong(
        new RepertoireSong({
          id: repertoireSong._id.toHexString(),
          title: repertoireSong.title,
          lyrics: repertoireSong.lyrics,
          label: repertoireSong.label,
          youtubeLink: repertoireSong.youtube_link,
          songId: repertoireSong.song.toHexString(),
          createdAt: repertoireSong.created_at,
          updatedAt: repertoireSong.updated_at,
        }),
      );
    });

    return repertoire;
  }
}
