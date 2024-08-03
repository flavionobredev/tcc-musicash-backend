import { randomUUID } from 'node:crypto';

function isUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
    uuid,
  );
}

export class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: BaseEntity.Constructor = {}) {
    this.id = props.id ?? randomUUID();
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt;
    if (!isUUID(this.id)) {
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
