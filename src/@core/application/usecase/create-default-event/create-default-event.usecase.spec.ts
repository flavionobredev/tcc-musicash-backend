import { randomUUID } from 'crypto';
import { RepertoireRepository } from 'src/@core/domain/repertoire/repository/repertoire.repository';
import { CreateDefaultEventUsecase } from './create-default-event.usecase';
import { EventRepository } from 'src/@core/domain/event/repository/event.repository';
import { UserRepository } from 'src/@core/domain/user/repository/user.repository';
import { UserNotFoundException } from '../../exception/user.exception';

describe('CreateDefaultEventUsecase', () => {
  const repertoireRepositorySpy: RepertoireRepository = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  const eventRepositorySpy: EventRepository = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be possible to create a default event', async () => {
    const userId = randomUUID();
    const userRepositorySpy: UserRepository = {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: userId }),
    };
    const now = new Date();
    const event = await new CreateDefaultEventUsecase(
      repertoireRepositorySpy,
      eventRepositorySpy,
      userRepositorySpy,
    ).execute({
      title: 'Event Title',
      description: 'Event Description',
      ownerId: userId,
      startDate: now,
    });

    expect(event).toBeDefined();
    expect(event.title).toBe('Event Title');
    expect(event.ownerId).toBe(userId);
    expect(event.startDate).toBe(now);
    expect(event.description).toBe('Event Description');
    expect(event.moments.length).toBe(1);
    expect(event.moments[0].title).toBe('Event Title');
    expect(event.moments[0].repertoireId).toBeDefined();
    expect(userRepositorySpy.findById).toHaveBeenCalledTimes(1);
    expect(repertoireRepositorySpy.create).toHaveBeenCalledTimes(1);
    expect(eventRepositorySpy.create).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception when user is not found', async () => {
    const userRepositorySpy: UserRepository = {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
    };

    await expect(
      new CreateDefaultEventUsecase(
        repertoireRepositorySpy,
        eventRepositorySpy,
        userRepositorySpy,
      ).execute({
        title: 'Event Title',
        ownerId: randomUUID(),
        startDate: new Date(),
      }),
    ).rejects.toBeInstanceOf(UserNotFoundException);
  });
});
