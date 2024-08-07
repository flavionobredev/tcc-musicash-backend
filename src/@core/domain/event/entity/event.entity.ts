import { BaseEntity } from 'src/@core/@shared/entity/base.entity';
import { isUUID } from 'src/@core/@shared/validators/string.validator';
import { EventMoment } from './event-moment.entity';

type EventConstructor = BaseEntity.Constructor & {
  title: string;
  ownerId: string;
  startDate: Date;
  description?: string;
  membersIds?: string[];
  managersIds?: string[];
  endDate?: Date;
  moments?: EventMoment[];
};

export class EventEntity extends BaseEntity {
  private _title: string;
  private _description: string;
  private _startDate: Date;
  private _endDate: Date;
  private _membersIds: string[];
  private _managersIds: string[];
  private _ownerId: string;
  private _moments: EventMoment[];

  constructor(props: EventConstructor) {
    super(props);
    this._title = props.title;
    this._description = props.description;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._membersIds = props.membersIds || [];
    this._managersIds = props.managersIds || [];
    this._ownerId = props.ownerId;
    this._moments = props.moments || [];
    this.validate();
  }

  private validate() {
    if (!this._title || this._title.length > 255) {
      throw new Error('Invalid title');
    }
    if (!isUUID(this._ownerId)) {
      throw new Error('Invalid ownerId');
    }
    if (!this._startDate) {
      throw new Error('Invalid startDate');
    }
    if (this._endDate && this._endDate < this._startDate) {
      throw new Error('Invalid endDate');
    }
    if (
      this._managersIds.length &&
      this._managersIds.some((id) => !isUUID(id))
    ) {
      throw new Error('Invalid managersIds');
    }
    if (this._membersIds.length && this._membersIds.some((id) => !isUUID(id))) {
      throw new Error('Invalid membersIds');
    }
    if (
      this._moments.length &&
      !this._moments.every((moment) => moment instanceof EventMoment)
    ) {
      throw new Error('Invalid moments');
    }
  }

  get title() {
    return this._title;
  }

  get moments() {
    return this._moments;
  }

  addMoment(moment: EventMoment) {
    const exists = this._moments.some((m) => m.itsMe(moment));
    if (exists) {
      throw new Error('Moment already exists');
    }
    this._moments.push(moment);
  }
}
