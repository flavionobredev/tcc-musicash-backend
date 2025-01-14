import { v7, validate } from 'uuid';

export class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: BaseEntity.Constructor = {}) {
    this.id = props.id ?? v7();
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt;
    if (!validate(this.id)) {
      throw new Error('Invalid UUID');
    }

    if (!this.createdAt || isNaN(this.createdAt.getTime())) {
      throw new Error('Invalid createdAt');
    }

    if (this.updatedAt && isNaN(this.updatedAt.getTime())) {
      throw new Error('Invalid updatedAt');
    }
  }
}

export namespace BaseEntity {
  export type Constructor = {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
