import RepositoryInterface from 'src/@core/@shared/repository/repository.interface';
import { Repertoire } from '../entity/repertoire.entity';

export abstract class RepertoireRepository
  implements RepositoryInterface<Repertoire>
{
  abstract create(entity: Repertoire): Promise<void>;
  abstract findById(id: string): Promise<Repertoire>;
}
