import { isUUID } from 'src/@core/@shared/validators/string.validator';

export enum EventMomentMemberAttribute {
  SINGER = 'SINGER',
  PLAYER = 'PLAYER',
  COORDINATOR = 'COORDINATOR',
}

export class EventMomentMember {
  userId: string;
  attributes: EventMomentMemberAttribute[];

  constructor(userId: string, attribute: EventMomentMemberAttribute[]) {
    if (!userId || !isUUID(userId)) {
      throw new Error('Invalid userId');
    }
    if (
      !attribute ||
      attribute.length === 0 ||
      !attribute.every((attr) => attr in EventMomentMemberAttribute)
    ) {
      throw new Error('Invalid attribute');
    }
    this.userId = userId;
    this.attributes = attribute;
  }
}
