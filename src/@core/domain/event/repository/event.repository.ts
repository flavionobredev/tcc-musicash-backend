import RepositoryInterface from 'src/@core/@shared/repository/repository.interface';
import { EventEntity } from '../entity/event.entity';

export abstract class EventRepository
  implements RepositoryInterface<EventEntity>
{
  abstract create(entity: EventEntity): Promise<void>;
  abstract findById(id: string): Promise<EventEntity>;
}
