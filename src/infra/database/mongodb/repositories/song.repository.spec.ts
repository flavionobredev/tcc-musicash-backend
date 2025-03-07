import { Model, Types } from 'mongoose';
import { Song } from 'src/@core/domain/song/entity/song.entity';
import { SongSchemaType } from '../schemas';
import { MongoDBSongRepository } from './song.repository';

describe('SongRepository unit tests', () => {
  const makeSut = () => {
    const songModel = {
      create: jest.fn(),
      findById: jest.fn().mockReturnValue({ lean: jest.fn() }),
    } as unknown as Model<SongSchemaType>;

    const sut = new MongoDBSongRepository(songModel);
    return { sut, songModel };
  };

  describe('create method', () => {
    it('should call create with correct values', async () => {
      const { sut, songModel } = makeSut();
      const song = new Song({
        title: 'any_title',
        artists: ['any_artist'],
        lyricPreview: 'any_lyric_preview',
        thumbnailLink: 'https://any_thumbnail_link.com',
        source: {
          provider: 'any_provider',
          providerSongId: 'any_provider_song_id',
        },
      });

      await sut.create(song);

      expect(songModel.create).toHaveBeenCalledWith({
        _id: song.id,
        title: song.title,
        artists: song.artists,
        lyric_preview: song.lyricPreview,
        thumbnail_link: song.thumbnailLink,
        external_provider: song.source.provider,
        external_provider_song_id: song.source.providerSongId,
      });
    });
  });

  describe('findById method', () => {
    it('should return null if song not found', async () => {
      const { sut, songModel } = makeSut();
      jest
        .spyOn(songModel, 'findById')
        .mockReturnValueOnce({ lean: jest.fn().mockReturnValue(null) } as any);

      const song = await sut.findById('any_id');

      expect(song).toBeNull();
    });

    it('should return song if song found', async () => {
      const { sut, songModel } = makeSut();
      const mock = {
        _id: new Types.ObjectId(),
        title: 'any_title',
        artists: ['any_artist'],
        lyric_preview: 'any_lyric_preview',
        thumbnail_link: 'https://any_thumbnail_link.com',
        external_provider: 'any_provider',
        external_provider_song_id: 'any_provider_song_id',
      };
      jest
        .spyOn(songModel, 'findById')
        .mockReturnValueOnce({ lean: jest.fn().mockReturnValue(mock) } as any);

      const song = await sut.findById('any_id');

      expect(songModel.findById).toHaveBeenCalledWith('any_id');
      expect(song).toHaveProperty('id', mock._id.toHexString());
      expect(song).toHaveProperty('title', mock.title);
    });
  });
});
