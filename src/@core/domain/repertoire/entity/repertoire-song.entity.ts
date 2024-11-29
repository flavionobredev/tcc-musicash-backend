import { BaseEntity } from 'src/@core/@shared/entity/base.entity';
import { EntityValidationException } from 'src/@core/@shared/exception/domain.exception';
import { isUrl } from 'src/@core/@shared/validators/string.validator';

type RepertoireSongConstructor = BaseEntity.Constructor & {
  title: string;
  lyrics: string;
  songId: string;
  label?: string;
  youtubeLink?: string;
};

export class RepertoireSong extends BaseEntity {
  readonly songId: string;
  private _title: string;
  private _lyrics: string;
  private _youtubeLink: string;
  private _label: string;

  constructor(props: RepertoireSongConstructor) {
    super(props);
    this._title = props.title;
    this._lyrics = props.lyrics;
    this.songId = props.songId;
    this._youtubeLink = props.youtubeLink;
    this._label = props.label;
    this.validate();
  }

  private validate() {
    if (!this._title) {
      throw new EntityValidationException('Invalid title');
    }

    if (this._title.length > 255) {
      throw new EntityValidationException(`invalid title length: ${this._title.length}`);
    }

    if (!this._lyrics) {
      throw new EntityValidationException('Invalid lyrics');
    }

    if (this._youtubeLink && !isUrl(this._youtubeLink)) {
      throw new EntityValidationException('Invalid youtubeLink');
    }

    if (this._label && this._label.length > 128) {
      throw new EntityValidationException(`invalid label length: ${this._label.length}`);
    }
  }

  get title() {
    return this._title;
  }

  get lyrics() {
    return this._lyrics;
  }

  get youtubeLink() {
    return this._youtubeLink;
  }

  get label() {
    return this._label;
  }

  changeTitle(title: string) {
    this._title = title;
    this.validate();
  }

  updateLyrics(lyrics: string) {
    this._lyrics = lyrics;
    this.validate();
  }

  addYoutubeLink(youtubeLink: string) {
    this._youtubeLink = youtubeLink;
    this.validate();
  }

  changeLabel(label: string) {
    this._label = label;
    this.validate();
  }
}
