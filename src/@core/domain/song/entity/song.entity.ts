import { BaseEntity } from 'src/@core/@shared/entity/base.entity';
import { EntityValidationException } from 'src/@core/@shared/exception/domain.exception';
import { isUrl } from 'src/@core/@shared/validators/string.validator';
import { SongSource } from '../value-object/song-source.vo';

type SongConstructor = BaseEntity.Constructor & {
  title: string;
  artists: string[];
  lyricPreview: string;
  thumbnailLink?: string;
  source: SongSource;
};

export class Song extends BaseEntity {
  readonly title: string;
  readonly artists: string[];
  readonly lyricPreview: string;
  thumbnailLink: string;
  source: SongSource;

  constructor(props: SongConstructor) {
    super(props);
    this.title = props.title;
    this.artists = props.artists;
    this.lyricPreview = props.lyricPreview;
    this.thumbnailLink = props.thumbnailLink;
    this.source = props.source;
    this.validate();
  }

  private validate() {
    if (!this.title) {
      throw new EntityValidationException('Invalid title');
    }

    if (!this.artists || this.artists.length === 0) {
      throw new EntityValidationException('Invalid artists');
    }

    if (!this.lyricPreview) {
      throw new EntityValidationException('Invalid lyricPreview');
    }

    if (this.thumbnailLink && !isUrl(this.thumbnailLink)) {
      throw new EntityValidationException('Invalid thumbnailLink');
    }

    if (!this.source) {
      throw new EntityValidationException('Invalid source');
    }
  }
}
