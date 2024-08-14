import { SongSource } from '../value-object/song-source.vo';
import { Song } from './song.entity';

describe('SongEntity', () => {
  it('should create a new SongEntity instance', () => {
    const input = {
      title: 'title',
      artists: ['artist'],
      lyricPreview: 'lyricPreview',
      thumbnailLink: 'https://thumbnailLink.com',
      source: new SongSource('provider', 'providerId'),
    };
    const songEntity = new Song(input);

    expect(songEntity.title).toBe(input.title);
    expect(songEntity.artists).toBe(input.artists);
    expect(songEntity.lyricPreview).toBe(input.lyricPreview);
    expect(songEntity.thumbnailLink).toBe(input.thumbnailLink);
    expect(songEntity.source).toStrictEqual(input.source);
  });

  it('should throw an error if title is invalid', () => {
    const input = {
      title: '',
      artists: ['artist'],
      lyricPreview: 'lyricPreview',
      thumbnailLink: 'https://thumbnailLink.com',
      source: new SongSource('provider', 'providerId'),
    };

    expect(() => new Song(input)).toThrow('Invalid title');
  });

  it('should throw an error if artists is invalid', () => {
    const input = {
      title: 'title',
      artists: [],
      lyricPreview: 'lyricPreview',
      thumbnailLink: 'https://thumbnailLink.com',
      source: new SongSource('provider', 'providerId'),
    };

    expect(() => new Song(input)).toThrow('Invalid artists');
    expect(() => new Song({ ...input, artists: undefined })).toThrow(
      'Invalid artists',
    );
  });

  it('should throw an error if lyricPreview is invalid', () => {
    const input = {
      title: 'title',
      artists: ['artist'],
      lyricPreview: '',
      thumbnailLink: 'https://thumbnailLink.com',
      source: new SongSource('provider', 'providerId'),
    };

    expect(() => new Song(input)).toThrow('Invalid lyricPreview');
  });

  it('should throw an error if thumbnailLink is invalid', () => {
    const input = {
      title: 'title',
      artists: ['artist'],
      lyricPreview: 'lyricPreview',
      thumbnailLink: 'invalid',
      source: new SongSource('provider', 'providerId'),
    };

    expect(() => new Song(input)).toThrow('Invalid thumbnailLink');
  });

  it('should throw an error if source is invalid', () => {
    const input = {
      title: 'title',
      artists: ['artist'],
      lyricPreview: 'lyricPreview',
      thumbnailLink: 'https://thumbnailLink.com',
      source: undefined,
    };

    expect(() => new Song(input)).toThrow('Invalid source');
  });
});
