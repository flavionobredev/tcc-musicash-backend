import RepositoryInterface from 'src/@core/@shared/repository/repository.interface';
import { User } from '../entity/user.entity';

export interface UserRepository extends RepositoryInterface<User> {
  upsertByEmail(user: User): Promise<void>;
}
