import { BaseEntity } from 'src/@core/@shared/entity/base.entity';
import { EntityValidationException } from 'src/@core/@shared/exception/domain.exception';
import { isEmail, isUrl } from 'src/@core/@shared/validators';

type UserConstructor = BaseEntity.Constructor & {
  email: string;
  name: string;
  picture?: string;
};

export class User extends BaseEntity {
  readonly email: string;
  private _name: string;
  private _picture?: string;

  constructor(props: UserConstructor) {
    super(props);
    this.email = props.email;
    this._name = props.name;
    this._picture = props.picture;
    this.validate();
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this._name,
      picture: this._picture,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private validate() {
    if (!isEmail(this.email)) {
      throw new EntityValidationException('Invalid user email');
    }
    if (this.email.length > 254) {
      throw new EntityValidationException('Email is too long');
    }
    if (!this._name) {
      throw new EntityValidationException('Invalid user name');
    }
    if (this._name.length > 50) {
      throw new EntityValidationException('Name is too long');
    }
    if (this._picture && !isUrl(this._picture)) {
      throw new EntityValidationException('Invalid picture url');
    }
  }

  get name() {
    return this._name;
  }

  get picture() {
    return this._picture;
  }

  set name(name: string) {
    this._name = name;
    this.validate();
  }
}
