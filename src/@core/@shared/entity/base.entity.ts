import { Types } from 'mongoose';

export class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: BaseEntity.Constructor = {}) {
    this.id = props.id ?? new Types.ObjectId().toHexString();
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt;
    if (!Types.ObjectId.isValid(this.id)) {
      throw new Error('Invalid ObjectId');
    }

    if (!this.createdAt || isNaN(this.createdAt.getTime())) {
      throw new Error('Invalid createdAt');
    }

    if (this.updatedAt && isNaN(this.updatedAt.getTime())) {
      throw new Error('Invalid updatedAt');
    }
  }

  toJSON() {
    throw new Error('Method not implemented.');
  }
}

export namespace BaseEntity {
  export type Constructor = {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
