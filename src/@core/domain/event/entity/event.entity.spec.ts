import { makeId } from 'test/@shared/generators/id.generator';
import { EventMoment } from './event-moment.entity';
import { EventEntity } from './event.entity';

describe('EventEntity unit test', () => {
  it('should be possible to create an instance of EventEntity', () => {
    const event = new EventEntity({
      title: 'Event Title',
      description: 'Event Description',
      ownerId: makeId(),
      startDate: new Date(),
    });

    expect(event).toBeDefined();
    expect(event.title).toBe('Event Title');
  });

  it('should throw an error if some required field is missing', () => {
    expect(
      () =>
        new EventEntity({
          title: '',
          description: 'Event Description',
          ownerId: makeId(),
          startDate: new Date(),
        }),
    ).toThrow('Invalid title');

    expect(
      () =>
        new EventEntity({
          title: 'Event Title',
          description: 'Event Description',
          ownerId: '',
          startDate: new Date(),
        }),
    ).toThrow('Invalid ownerId');

    expect(
      () =>
        new EventEntity({
          title: 'Event Title',
          description: 'Event Description',
          ownerId: makeId(),
          startDate: null,
        }),
    ).toThrow('Invalid startDate');
  });

  it('should throw an error if the endDate is before the startDate', () => {
    expect(
      () =>
        new EventEntity({
          title: 'Event Title',
          description: 'Event Description',
          ownerId: makeId(),
          startDate: new Date(),
          endDate: new Date('2021-01-01'),
        }),
    ).toThrow('Invalid endDate');
  });

  // it('should throw an error if the managersIds are invalid UUID', () => {
  //   expect(
  //     () =>
  //       new EventEntity({
  //         title: 'Event Title',
  //         description: 'Event Description',
  //         ownerId: makeId(),
  //         startDate: new Date(),
  //         managersIds: ['invalid-id'],
  //       }),
  //   ).toThrow('Invalid managersIds');
  // });

  // it('should throw an error if the membersIds are invalid UUID', () => {
  //   expect(
  //     () =>
  //       new EventEntity({
  //         title: 'Event Title',
  //         description: 'Event Description',
  //         ownerId: makeId(),
  //         startDate: new Date(),
  //         membersIds: ['invalid-id'],
  //       }),
  //   ).toThrow('Invalid membersIds');
  // });

  it("should be possible to add a moment to the event's moments", () => {
    const event = new EventEntity({
      title: 'Event Title',
      description: 'Event Description',
      ownerId: makeId(),
      startDate: new Date(),
    });

    const moment = new EventMoment({
      title: 'Event Moment Title',
    });

    event.addMoment(moment);

    expect(event.moments.length).toBe(1);
    expect(event.moments[0].title).toBe('Event Moment Title');
  });

  it('should throw an error if the moment already exists', () => {
    const event = new EventEntity({
      title: 'Event Title',
      description: 'Event Description',
      ownerId: makeId(),
      startDate: new Date(),
    });

    const moment = new EventMoment({
      title: 'Event Moment Title',
    });

    event.addMoment(moment);

    expect(() => event.addMoment(moment)).toThrow('Moment already exists');
  });

  it('should return the event slug', () => {
    const event1 = new EventEntity({
      title: 'Event Title',
      description: 'Event Description',
      ownerId: makeId(),
      startDate: new Date(),
    });

    expect(event1.slug).toContain('event-title');

    const event2 = new EventEntity({
      title: 'Another Event Title',
      description: 'Another Event Description',
      ownerId: makeId(),
      startDate: new Date(),
      slug: 'another-event-title',
    });

    expect(event2.slug).toBe(`another-event-title`);
  });
});
