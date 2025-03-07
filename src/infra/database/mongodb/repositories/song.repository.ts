import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Song } from 'src/@core/domain/song/entity/song.entity';
import { SongRepository } from 'src/@core/domain/song/repository/song.repository';
import { MongoModelsName } from '../models.enum';
import { SongSchemaType } from '../schemas';

export class MongoDBSongRepository implements SongRepository {
  constructor(
    @Inject(MongoModelsName.Songs)
    private readonly model: Model<SongSchemaType>,
  ) {}

  async create(entity: Song) {
    await this.model.create({
      _id: entity.id,
      title: entity.title,
      artists: entity.artists,
      lyric_preview: entity.lyricPreview,
      thumbnail_link: entity.thumbnailLink,
      external_provider: entity.source.provider,
      external_provider_song_id: entity.source.providerSongId,
    });
  }

  async findById(id: string): Promise<Song> {
    const result = await this.model.findById(id).lean();
    if (!result) return null;
    return new Song({
      id: result._id.toHexString(),
      title: result.title,
      artists: result.artists,
      lyricPreview: result.lyric_preview,
      thumbnailLink: result.thumbnail_link,
      source: {
        provider: result.external_provider,
        providerSongId: result.external_provider_song_id,
      },
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }
}
