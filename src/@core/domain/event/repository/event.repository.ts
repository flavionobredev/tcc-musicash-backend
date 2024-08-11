import RepositoryInterface from 'src/@core/@shared/repository/repository.interface';
import { EventEntity } from '../entity/event.entity';

export interface EventRepository extends RepositoryInterface<EventEntity> {}
