import { BaseEntity } from 'src/@core/@shared/entity/base.entity';

type EventConstructor = BaseEntity.Constructor & {
  title: string;
  ownerId: string;
  startDate: Date;
  description?: string;
  membersIds?: string[];
  managersIds?: string[];
  endDate?: Date;
};

export class EventEntity extends BaseEntity {
  private _title: string;
  private _description: string;
  private _startDate: Date;
  private _endDate: Date;
  private _membersIds: string[];
  private _managersIds: string[];
  private _ownerId: string;

  constructor(props: EventConstructor) {
    super(props);
    this._title = props.title;
    this._description = props.description;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._membersIds = props.membersIds || [];
    this._managersIds = props.managersIds || [];
    this._ownerId = props.ownerId;
  }
}
