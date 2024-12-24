import RepositoryInterface from 'src/@core/@shared/repository/repository.interface';
import { User } from '../entity/user.entity';

export abstract class UserRepository implements RepositoryInterface<User> {
  abstract findById(id: string): Promise<User | null>;
  abstract create(entity: User): Promise<void>;
  abstract upsertByEmail(user: User): Promise<void>;
}