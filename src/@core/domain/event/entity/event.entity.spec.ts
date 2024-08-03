import { randomUUID } from 'crypto';
import { EventEntity } from './event.entity';

describe('EventEntity', () => {
  it('should be possible to create an instance of EventEntity', () => {
    const event = new EventEntity({
      title: 'Event Title',
      description: 'Event Description',
      ownerId: randomUUID(),
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
          ownerId: randomUUID(),
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
          ownerId: randomUUID(),
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
          ownerId: randomUUID(),
          startDate: new Date(),
          endDate: new Date('2021-01-01'),
        }),
    ).toThrow('Invalid endDate');
  });

  it('should throw an error if the managersIds are invalid UUID', () => {
    expect(
      () =>
        new EventEntity({
          title: 'Event Title',
          description: 'Event Description',
          ownerId: randomUUID(),
          startDate: new Date(),
          managersIds: ['invalid-id'],
        }),
    ).toThrow('Invalid managersIds');
  });

  it('should throw an error if the membersIds are invalid UUID', () => {
    expect(
      () =>
        new EventEntity({
          title: 'Event Title',
          description: 'Event Description',
          ownerId: randomUUID(),
          startDate: new Date(),
          membersIds: ['invalid-id'],
        }),
    ).toThrow('Invalid membersIds');
  });
});
