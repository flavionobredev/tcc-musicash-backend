import { Model, Types } from 'mongoose';
import { RepertoireSong } from 'src/@core/domain/repertoire/entity/repertoire-song.entity';
import { Repertoire } from 'src/@core/domain/repertoire/entity/repertoire.entity';
import { RepertoireSchemaType, RepertoireSongSchemaType } from '../schemas';
import { MongoDBRepertoireRepository } from './repertoire.repository';

describe('RepertoireRepository unit tests', () => {
  const makeSut = () => {
    const repertoireModel = {
      create: jest.fn(),
      findById: jest.fn().mockReturnValue({ populate: jest.fn() }),
      db: {
        startSession: jest.fn().mockResolvedValue({
          endSession: jest.fn(),
          withTransaction: (fn) => fn(),
        }),
      },
    } as unknown as Model<RepertoireSchemaType>;

    const repertoireSongModel = {
      create: jest.fn(),
    } as unknown as Model<RepertoireSongSchemaType>;

    const sut = new MongoDBRepertoireRepository(
      repertoireModel,
      repertoireSongModel,
    );
    return { sut, repertoireModel, repertoireSongModel };
  };

  describe('create method', () => {
    it('should create a repertoire with its songs', async () => {
      const { sut, repertoireModel, repertoireSongModel } = makeSut();
      const repertoire = new Repertoire({
        title: 'any_title',
        description: 'any_description',
      });

      repertoire.addSong(
        new RepertoireSong({
          title: 'any_title',
          lyrics: 'any_lyrics',
          label: 'any_label',
          youtubeLink: 'https://any_youtube_link.com',
          songId: 'any_song_id',
        }),
      );

      await sut.create(repertoire);

      expect(repertoireModel.create).toHaveBeenCalledWith({
        _id: repertoire.id,
        title: repertoire.title,
        description: repertoire.description,
        songs: [repertoire.songs[0].id],
      });

      expect(repertoireSongModel.create).toHaveBeenCalledWith({
        _id: repertoire.songs[0].id,
        title: repertoire.songs[0].title,
        lyrics: repertoire.songs[0].lyrics,
        label: repertoire.songs[0].label,
        youtube_link: repertoire.songs[0].youtubeLink,
        repertoire: repertoire.id,
        song: repertoire.songs[0].songId,
      });
    });
  });

  describe('findById method', () => {
    it('should return null if repertoire not found', async () => {
      const { sut, repertoireModel } = makeSut();
      jest.spyOn(repertoireModel, 'findById').mockReturnValueOnce({
        populate: jest.fn().mockReturnValue(null),
      } as any);

      const repertoire = await sut.findById('any_id');

      expect(repertoire).toBeNull();
    });

    it('should return repertoire if repertoire found', async () => {
      const { sut, repertoireModel } = makeSut();
      const mock = {
        _id: new Types.ObjectId(),
        title: 'any_title',
        description: 'any_description',
        songs: [
          {
            _id: new Types.ObjectId(),
            title: 'any_title',
            lyrics: 'any_lyrics',
            label: 'any_label',
            youtube_link: 'https://any_youtube_link.com',
            song: new Types.ObjectId()
          },
        ],
      };
      jest.spyOn(repertoireModel, 'findById').mockReturnValueOnce({
        populate: jest.fn().mockReturnValue(mock),
      } as any);

      const repertoire = await sut.findById('any_id');

      expect(repertoireModel.findById).toHaveBeenCalledWith('any_id');
      expect(repertoire).toHaveProperty('id', mock._id.toHexString());
      expect(repertoire).toHaveProperty('title', mock.title);
      expect(repertoire.songs).toHaveLength(1);
    });
  });
});
