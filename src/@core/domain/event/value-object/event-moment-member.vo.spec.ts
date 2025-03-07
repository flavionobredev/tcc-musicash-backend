import { makeId } from 'test/@shared/generators/id.generator';
import {
  EventMomentMember,
  EventMomentMemberAttribute,
} from './event-moment-member.vo';

describe('EventMomentMemberValueObject unit test', () => {
  it('should be possible to create an instance of EventMomentMemberValueObject', () => {
    const eventMomentMember = new EventMomentMember(makeId(), [
      EventMomentMemberAttribute.PLAYER,
    ]);

    expect(eventMomentMember).toBeDefined();
  });

  it('should throw an error if the memberId is invalid', () => {
    expect(() => new EventMomentMember('invalid-uuid', [])).toThrow(
      'Invalid userId',
    );
  });

  it('should throw an error if the attribute is invalid', () => {
    expect(() => new EventMomentMember(makeId(), [])).toThrow(
      'Invalid attribute',
    );
  });

  it('should throw an error if the attribute is invalid', () => {
    expect(() => new EventMomentMember(makeId(), [null])).toThrow(
      'Invalid attribute',
    );
  });
});
