import { randomUUID } from 'crypto';
import {
  EventMomentMember,
  EventMomentMemberAttribute,
} from '../value-object/event-moment-member.vo';
import { EventMoment } from './event-moment.entity';

describe('EventMomentEntity', () => {
  it('should be possible to create an instance of EventMoment', () => {
    const eventMoment = new EventMoment({
      title: 'Event Moment Title',
      description: 'Event Moment Description',
      startDate: new Date(),
    });

    expect(eventMoment).toBeDefined();
    expect(eventMoment.title).toBe('Event Moment Title');
  });

  it('should throw an error if some required field is missing', () => {
    expect(
      () =>
        new EventMoment({
          title: '',
        }),
    ).toThrow('Invalid title');
  });

  it('should throw an error if the endDate is before the startDate', () => {
    expect(
      () =>
        new EventMoment({
          title: 'Event Moment Title',
          description: 'Event Moment Description',
          startDate: new Date(),
          endDate: new Date('2021-01-01'),
        }),
    ).toThrow('Invalid endDate');
  });

  it('should throw an error if the repertoireId is invalid', () => {
    expect(
      () =>
        new EventMoment({
          title: 'Event Moment Title',
          repertoireId: 'invalid-uuid',
        }),
    ).toThrow('Invalid repertoireId');
  });

  it('should be possible add an repertoire by repertoireId', () => {
    const eventMoment = new EventMoment({
      title: 'Event Moment Title',
    });

    const repertoireId = randomUUID();

    eventMoment.changeRepertoireId(repertoireId);

    expect(eventMoment.repertoireId).toEqual(repertoireId);
  });

  it('should throw an error if the members are invalid', () => {
    expect(
      () =>
        new EventMoment({
          title: 'Event Moment Title',
          members: [{} as any],
        }),
    ).toThrow('Invalid members');
  });

  it('should be possible add eventMembers', () => {
    const eventMoment = new EventMoment({
      title: 'Event Moment Title',
    });

    const singer = new EventMomentMember(randomUUID(), [
      EventMomentMemberAttribute.SINGER,
    ]);
    const singerAndPlayer = new EventMomentMember(randomUUID(), [
      EventMomentMemberAttribute.SINGER,
      EventMomentMemberAttribute.PLAYER,
    ]);

    eventMoment.addMember(singer);
    eventMoment.addMember(singerAndPlayer);

    expect(eventMoment.members).toStrictEqual([singer, singerAndPlayer]);
  });

  it('should be verify if the eventMoment is the same as the eventMoment passed', () => {
    const eventMoment = new EventMoment({
      title: 'Event Moment Title',
    });

    const anotherEventMoment = new EventMoment({
      title: 'Another Event Moment Title',
    });

    expect(eventMoment.itsMe(anotherEventMoment)).toBeFalsy();
    expect(eventMoment.itsMe(eventMoment)).toBeTruthy();
  });
});
