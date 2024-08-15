import { RepertoireSong } from './repertoire-song.entity';
import { Repertoire } from './repertoire.entity';

describe('RepertoireEntity', () => {
  it('should be possible to create a new repertoire', () => {
    const repertoire = new Repertoire({
      title: 'Repertoire Name',
      description: '',
    });
    expect(repertoire.title).toBe('Repertoire Name');
    expect(repertoire.description).toBe('');
  });

  it('should throw an error if the title is invalid', () => {
    expect(
      () =>
        new Repertoire({
          title: '',
          description: '',
        }),
    ).toThrow('Invalid title');
  });

  it('should be possible update title and description', () => {
    const repertoire = new Repertoire({
      title: 'Repertoire Name',
      description: '',
    });
    repertoire.changeTitle('New Repertoire Name');
    repertoire.changeDescription('New Description');
    expect(repertoire.title).toBe('New Repertoire Name');
    expect(repertoire.description).toBe('New Description');
  });

  it('should throw an error if the title is invalid when updating', () => {
    const repertoire = new Repertoire({
      title: 'Repertoire Name',
      description: '',
    });
    expect(() => repertoire.changeTitle('')).toThrow('Invalid title');
  });

  it('should be possible add songs to the repertoire', () => {
    const repertoire = new Repertoire({
      title: 'Repertoire Name',
    });
    const repertoireSong = new RepertoireSong({
      title: 'Repertoire Song',
      lyrics: 'lyrics',
      songId: 'songId',
    });
    repertoire.addSong(repertoireSong);
    expect(repertoire.songs.length).toBe(1);
  });
});
