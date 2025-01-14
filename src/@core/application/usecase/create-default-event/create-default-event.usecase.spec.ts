import { EventRepository } from 'src/@core/domain/event/repository/event.repository';
import { RepertoireRepository } from 'src/@core/domain/repertoire/repository/repertoire.repository';
import { UserRepository } from 'src/@core/domain/user/repository/user.repository';
import { v7 } from 'uuid';
import { UserNotFoundException } from '../../exception';
import { CreateDefaultEventUsecase } from './create-default-event.usecase';

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
    const userId = v7();
    const userRepositorySpy: UserRepository = {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: userId }),
      upsertByEmail: jest.fn(),
      findByEmail: jest.fn(),
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
    expect(userRepositorySpy.findById).toHaveBeenCalledTimes(1);
    expect(repertoireRepositorySpy.create).toHaveBeenCalledTimes(1);
    expect(eventRepositorySpy.create).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception when user is not found', async () => {
    const userRepositorySpy: UserRepository = {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn(),
      upsertByEmail: jest.fn(),
    };

    await expect(
      new CreateDefaultEventUsecase(
        repertoireRepositorySpy,
        eventRepositorySpy,
        userRepositorySpy,
      ).execute({
        title: 'Event Title',
        ownerId: v7(),
        startDate: new Date(),
      }),
    ).rejects.toBeInstanceOf(UserNotFoundException);
  });
});
