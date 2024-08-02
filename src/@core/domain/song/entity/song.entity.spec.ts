import { SongSource } from '../value-object/song-source.vo';
import { SongEntity } from './song.entity';

describe('SongEntity', () => {
  it('should create a new SongEntity instance', () => {
    const input = {
      title: 'title',
      artists: ['artist'],
      lyricPreview: 'lyricPreview',
      musicImageLink: 'https://musicImageLink.com',
      source: new SongSource('provider', 'providerId'),
    };
    const songEntity = new SongEntity(input);

    expect(songEntity.title).toBe(input.title);
    expect(songEntity.artists).toBe(input.artists);
    expect(songEntity.lyricPreview).toBe(input.lyricPreview);
    expect(songEntity.musicImageLink).toBe(input.musicImageLink);
    expect(songEntity.source).toStrictEqual(input.source);
  });

  it('should throw an error if title is invalid', () => {
    const input = {
      title: '',
      artists: ['artist'],
      lyricPreview: 'lyricPreview',
      musicImageLink: 'https://musicImageLink.com',
      source: new SongSource('provider', 'providerId'),
    };

    expect(() => new SongEntity(input)).toThrow('Invalid title');
  });

  it('should throw an error if artists is invalid', () => {
    const input = {
      title: 'title',
      artists: [],
      lyricPreview: 'lyricPreview',
      musicImageLink: 'https://musicImageLink.com',
      source: new SongSource('provider', 'providerId'),
    };

    expect(() => new SongEntity(input)).toThrow('Invalid artists');
    expect(() => new SongEntity({ ...input, artists: undefined })).toThrow(
      'Invalid artists',
    );
  });

  it('should throw an error if lyricPreview is invalid', () => {
    const input = {
      title: 'title',
      artists: ['artist'],
      lyricPreview: '',
      musicImageLink: 'https://musicImageLink.com',
      source: new SongSource('provider', 'providerId'),
    };

    expect(() => new SongEntity(input)).toThrow('Invalid lyricPreview');
  });

  it('should throw an error if musicImageLink is invalid', () => {
    const input = {
      title: 'title',
      artists: ['artist'],
      lyricPreview: 'lyricPreview',
      musicImageLink: 'invalid',
      source: new SongSource('provider', 'providerId'),
    };

    expect(() => new SongEntity(input)).toThrow('Invalid musicImageLink');
  });

  it('should throw an error if source is invalid', () => {
    const input = {
      title: 'title',
      artists: ['artist'],
      lyricPreview: 'lyricPreview',
      musicImageLink: 'https://musicImageLink.com',
      source: undefined,
    };

    expect(() => new SongEntity(input)).toThrow('Invalid source');
  });
});
