import { randomUUID } from 'crypto';
import { CreateDefaultEventUsecase } from './create-default-event.usecase';
import { RepertoireRepository } from 'src/@core/domain/repertoire/repository/repertoire.repository';
import { Repertoire } from 'src/@core/domain/repertoire/entity/repertoire.entity';

class RepertoireRepositoryInMemory implements RepertoireRepository {
  private readonly db = new Map();

  create(entity: Repertoire): Promise<void> {
    this.db.set(entity.id, entity);
    return;
  }
}

describe('CreateDefaultEventUsecase', () => {

  const makeSut = () => {
    return new CreateDefaultEventUsecase(new RepertoireRepositoryInMemory());
  }

  it('should be possible to create a default event', async () => {
    const userId = randomUUID();
    const event = await makeSut().execute({
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
