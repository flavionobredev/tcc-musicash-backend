# Base Entity
Esse é um template de uma entity:

```typescript
import { Types } from 'mongoose';
import { BaseEntity } from 'src/@core/@shared/entity/base.entity';
import { EntityValidationException } from 'src/@core/@shared/exception/domain.exception';

export class EventEngagement extends BaseEntity {
  static create(input: EventEngagement.CreateInput) {
    return new EventEngagement({
      userId: input.userId,
      eventId: input.eventId,
      role: input.role,
      status: EventEngagement.Status.ACTIVE,
    });
  }

  static restore(input: EventEngagement.RestoreInput) {
    return new EventEngagement({
      ...input,
    } as EventEngagement.Constructor);
  }

  private userId: string;
  private eventId: string;
  private role: EventEngagement.Roles;
  private status: EventEngagement.Status;

  private constructor(props: EventEngagement.Constructor) {
    super(props);
    this.userId = props.userId;
    this.eventId = props.eventId;
    this.role = props.role;
    this.status = props.status;
    this.validate();
  }

  private validate() {
    if (!Types.ObjectId.isValid(this.userId)) {
      throw new EntityValidationException('Invalid userId');
    }
    if (!Types.ObjectId.isValid(this.eventId)) {
      throw new EntityValidationException('Invalid eventId');
    }
    if (!Object.values(EventEngagement.Roles).includes(this.role)) {
      throw new EntityValidationException('Invalid role');
    }
    if (!Object.values(EventEngagement.Status).includes(this.status)) {
      throw new EntityValidationException('Invalid status');
    }
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      eventId: this.eventId,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export namespace EventEngagement {
  /**
   * os enum's poderiam ser vo,
   * mas não quero adicionar mais complexidade
   */
  export enum Roles {
    MEMBER = 'member',
    OWNER = 'owner',
  }

  export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
  }

  export type CreateInput = {
    userId: string;
    eventId: string;
    role: Roles;
  };

  export type Constructor = BaseEntity.Constructor & {
    userId: string;
    eventId: string;
    role: Roles;
    status: Status;
  };

  export type RestoreInput = Partial<Constructor>;
}

```