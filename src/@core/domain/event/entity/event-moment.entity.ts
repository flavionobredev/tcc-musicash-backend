import { BaseEntity } from 'src/@core/@shared/entity/base.entity';
import { EntityValidationException } from 'src/@core/@shared/exception/domain.exception';
import { isUUID } from 'src/@core/@shared/validators/string.validator';
import { EventMomentMember } from '../value-object/event-moment-member.vo';

type EventMomentConstructor = BaseEntity.Constructor & {
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  repertoireId?: string;
  members?: EventMomentMember[];
};

export class EventMoment extends BaseEntity {
  private _title: string;
  private _description: string;
  private _startDate: Date;
  private _endDate: Date;
  private _repertoireId: string;
  private _members: EventMomentMember[];

  constructor(props: EventMomentConstructor) {
    super(props);
    this._title = props.title;
    this._description = props.description;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._repertoireId = props.repertoireId;
    this._members = props.members || [];
    this.validate();
  }

  private validate() {
    if (!this._title || this._title.length > 255) {
      throw new EntityValidationException('Invalid title');
    }
    if (this._startDate && this._endDate && this._endDate < this._startDate) {
      throw new EntityValidationException('Invalid endDate');
    }
    if (this._repertoireId && !isUUID(this._repertoireId)) {
      throw new EntityValidationException('Invalid repertoireId');
    }
    if (
      this._members.length &&
      !this._members.every((member) => member instanceof EventMomentMember)
    ) {
      throw new EntityValidationException('Invalid members');
    }
  }

  get title() {
    return this._title;
  }

  get repertoireId() {
    return this._repertoireId;
  }

  get members() {
    return this._members;
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

  changeRepertoireId(repertoireId: string) {
    this._repertoireId = repertoireId;
    this.validate();
  }

  addMember(member: EventMomentMember) {
    const index = this._members.findIndex((m) => m.userId === member.userId);
    if (index !== -1) {
      this._members[index] = member;
      this.validate();
      return;
    }
    this._members.push(member);
    this.validate();
  }

  itsMe(eventMoment: EventMoment) {
    return this.id === eventMoment.id;
  }
}
