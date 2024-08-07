import { randomUUID } from 'crypto';
import { CreateDefaultEventUsecase } from './create-default-event.usecase';

describe('CreateDefaultEventUsecase', () => {
  it('should be possible to create a default event', () => {
    const userId = randomUUID();
    const event = new CreateDefaultEventUsecase().execute({
      title: 'Event Title',
      ownerId: userId,
      startDate: new Date(),
    });

    expect(event).toBeDefined();
    expect(event.moments.length).toBe(1);
    expect(event.moments[0].title).toBe('Event Title');
    expect(event.moments[0].repertoireId).toBeDefined();
  });
});
