import RepositoryInterface from 'src/@core/@shared/repository/repository.interface';
import { Song } from '../entity/song.entity';

export abstract class SongRepository implements RepositoryInterface<Song> {
  abstract create(entity: Song): Promise<void>;
  abstract findById(id: string): Promise<Song>;
}
