import { PrismaClient } from '@prisma/client';
import { Song } from 'src/@core/domain/song/entity/song.entity';
import { SongRepository } from 'src/@core/domain/song/repository/song.repository';
import {
  stringArraytoString,
  stringToStringArray,
} from 'test/@shared/utils/prisma/array-parser.util';

export class PrismaSongRepository implements SongRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(entity: Song): Promise<void> {
    await this.prisma.songs.create({
      data: {
        id: entity.id,
        title: entity.title,
        artists: stringArraytoString(entity.artists),
        lyricPreview: entity.lyricPreview,
        thumbnailLink: entity.thumbnailLink,
        externalProvider: entity.source.provider,
        externalProviderSongId: entity.source.providerSongId,
      },
    });
  }
  async findById(id: string): Promise<Song> {
    const result = await this.prisma.songs.findUnique({ where: { id } });
    if (!result) return null;
    return new Song({
      id: result.id,
      title: result.title,
      artists: stringToStringArray(result.artists),
      lyricPreview: result.lyricPreview,
      thumbnailLink: result.thumbnailLink,
      source: {
        provider: result.externalProvider,
        providerSongId: result.externalProviderSongId,
      },
    });
  }
}
