import { BaseEntity } from 'src/@core/@shared/entity/base.entity';
import { EntityValidationException } from 'src/@core/@shared/exception/domain.exception';
import { RepertoireSong } from './repertoire-song.entity';

type RepertoireConstructor = BaseEntity.Constructor & {
  title: string;
  description?: string;
};

export class Repertoire extends BaseEntity {
  private _title: string;
  private _description: string;
  private _songs: RepertoireSong[] = [];

  constructor(props: RepertoireConstructor) {
    super(props);
    this._title = props.title;
    this._description = props.description;
    this.validate();
  }

  private validate() {
    if (!this._title) {
      throw new EntityValidationException('Invalid title');
    }
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get songs() {
    return this._songs;
  }

  changeTitle(title: string) {
    this._title = title;
    this.validate();
  }

  changeDescription(description: string) {
    this._description = description;
  }

  addSong(song: RepertoireSong) {
    this._songs.push(song);
  }
}
