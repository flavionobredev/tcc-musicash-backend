import RepositoryInterface from 'src/@core/@shared/repository/repository.interface';
import { Song } from '../entity/song.entity';

export interface SongRepository extends RepositoryInterface<Song> {}
