import { Types } from 'mongoose';
import { BaseEntity } from 'src/@core/@shared/entity/base.entity';
import { EntityValidationException } from 'src/@core/@shared/exception/domain.exception';
import { EventMoment } from './event-moment.entity';
import slugify from 'slugify';

type EventConstructor = BaseEntity.Constructor & {
  title: string;
  ownerId: string;
  startDate: Date;
  description?: string;
  type?: string;
  // membersIds?: string[];
  // managersIds?: string[];
  endDate?: Date;
  moments?: EventMoment[];
};

export class EventEntity extends BaseEntity {
  private _title: string;
  private _description: string;
  private _startDate: Date;
  private _endDate: Date;
  private _type: string;
  // private _membersIds: string[];
  // private _managersIds: string[];
  private _ownerId: string;
  private _moments: EventMoment[];

  constructor(props: EventConstructor) {
    super(props);
    this._title = props.title;
    this._description = props.description;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._type = props.type;
    // this._membersIds = props.membersIds || [];
    // this._managersIds = props.managersIds || [];
    this._ownerId = props.ownerId;
    this._moments = props.moments || [];
    this.validate();
  }

  private validate() {
    if (!this._title || this._title.length > 255) {
      throw new EntityValidationException('Invalid title');
    }
    if (!Types.ObjectId.isValid(this._ownerId)) {
      throw new EntityValidationException('Invalid ownerId');
    }
    if (!this._startDate) {
      throw new EntityValidationException('Invalid startDate');
    }
    if (this._endDate && this._endDate < this._startDate) {
      throw new EntityValidationException('Invalid endDate');
    }
    if (this._type && this._type.length > 255) {
      throw new EntityValidationException('Invalid type');
    }
    if (
      this._moments.length &&
      !this._moments.every((moment) => moment instanceof EventMoment)
    ) {
      throw new EntityValidationException('Invalid moments');
    }
  }

  get title() {
    return this._title;
  }

  get moments() {
    return this._moments;
  }

  get ownerId() {
    return this._ownerId;
  }

  get startDate() {
    return this._startDate;
  }

  get endDate() {
    return this._endDate;
  }

  get description() {
    return this._description;
  }

  get type() {
    return this._type;
  }

  get slug() {
    return slugify(`${this.id}-${this._title}`, { lower: true });
  }

  addMoment(moment: EventMoment) {
    const exists = this._moments.some((m) => m.itsMe(moment));
    if (exists) {
      throw new Error('Moment already exists');
    }
    this._moments.push(moment);
  }
}
