import RepositoryInterface from 'src/@core/@shared/repository/repository.interface';
import { EventEntity } from '../entity/event.entity';
import { EventEngagement } from '../entity/event-engagement.entity';

export abstract class EventRepository
  implements RepositoryInterface<EventEntity>
{
  abstract create(entity: EventEntity): Promise<void>;
  abstract findById(id: string): Promise<EventEntity>;
  abstract upsertEngagementByEventAndUser(eventEngagement: EventEngagement): Promise<void>;
}
