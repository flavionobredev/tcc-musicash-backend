import { RepertoireSong } from './repertoire-song.entity';

describe('RepertoireSongEntity', () => {
  it('should be possible to create a new repertoire song', () => {
    const repertoireSong = new RepertoireSong({
      title: 'Repertoire Song',
      lyrics: 'lyrics',
      songId: 'songId',
    });
    expect(repertoireSong).toBeDefined();
    expect(repertoireSong.title).toBe('Repertoire Song');
  });

  it('shoulde be possible change the title', () => {
    const repertoireSong = new RepertoireSong({
      title: 'Repertoire Song',
      lyrics: 'lyrics',
      songId: 'songId',
    });
    repertoireSong.changeTitle('New Repertoire Song');
    expect(repertoireSong.title).toBe('New Repertoire Song');
  });

  it('should throw an error if the title is invalid in change', () => {
    const repertoireSong = new RepertoireSong({
      title: 'Repertoire Song',
      lyrics: 'lyrics',
      songId: 'songId',
    });
    expect(() => repertoireSong.changeTitle('')).toThrow('Invalid title');
  });

  it('should be possible add a youtube link', () => {
    const repertoireSong = new RepertoireSong({
      title: 'Repertoire Song',
      lyrics: 'lyrics',
      songId: 'songId',
    });
    repertoireSong.addYoutubeLink('https://youtube.com');
    expect(repertoireSong.youtubeLink).toBe('https://youtube.com');
  });

  it('should throw an error if the youtube link is invalid', () => {
    const repertoireSong = new RepertoireSong({
      title: 'Repertoire Song',
      lyrics: 'lyrics',
      songId: 'songId',
    });
    expect(() => repertoireSong.addYoutubeLink('invalid-url')).toThrow(
      'Invalid youtubeLink',
    );
  });

  it('should be possible update the lyrics', () => {
    const repertoireSong = new RepertoireSong({
      title: 'Repertoire Song',
      lyrics: 'lyrics',
      songId: 'songId',
    });
    repertoireSong.updateLyrics('new lyrics');
    expect(repertoireSong.lyrics).toBe('new lyrics');
  });

  it('should throw an error if the lyrics is invalid', () => {
    const repertoireSong = new RepertoireSong({
      title: 'Repertoire Song',
      lyrics: 'lyrics',
      songId: 'songId',
    });
    expect(() => repertoireSong.updateLyrics('')).toThrow('Invalid lyrics');
  });

  it('should be possible add a label', () => {
    const repertoireSong = new RepertoireSong({
      title: 'Repertoire Song',
      lyrics: 'lyrics',
      songId: 'songId',
    });
    repertoireSong.changeLabel('label');
    expect(repertoireSong.label).toBe('label');
  });
});
