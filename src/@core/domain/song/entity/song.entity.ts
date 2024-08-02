import { BaseEntity } from 'src/@core/@shared/entity/base.entity';
import { SongSource } from '../value-object/song-source.vo';
import { isUrl } from 'src/@core/@shared/validators/string.validator';

type SongConstructor = BaseEntity.Constructor & {
  title: string;
  artists: string[];
  lyricPreview: string;
  musicImageLink?: string;
  source: SongSource;
};

export class Song extends BaseEntity {
  readonly title: string;
  readonly artists: string[];
  readonly lyricPreview: string;
  musicImageLink: string;
  source: SongSource;

  constructor(props: SongConstructor) {
    super(props);
    this.title = props.title;
    this.artists = props.artists;
    this.lyricPreview = props.lyricPreview;
    this.musicImageLink = props.musicImageLink;
    this.source = props.source;
    this.validate();
  }

  private validate() {
    if (!this.title) {
      throw new Error('Invalid title');
    }

    if (!this.artists || this.artists.length === 0) {
      throw new Error('Invalid artists');
    }

    if (!this.lyricPreview) {
      throw new Error('Invalid lyricPreview');
    }

    if (this.musicImageLink && !isUrl(this.musicImageLink)) {
      throw new Error('Invalid musicImageLink');
    }

    if (!this.source) {
      throw new Error('Invalid source');
    }
  }
}
