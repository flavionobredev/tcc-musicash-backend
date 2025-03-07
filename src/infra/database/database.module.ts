import { Global, Logger, Module } from '@nestjs/common';
import { connect, Connection } from 'mongoose';
import { EventRepository } from 'src/@core/domain/event/repository/event.repository';
import { RepertoireRepository } from 'src/@core/domain/repertoire/repository/repertoire.repository';
import { SongRepository } from 'src/@core/domain/song/repository/song.repository';
import { UserRepository } from 'src/@core/domain/user';
import { MongoModelsName } from './mongodb/models.enum';
import {
  MongoDBEventRepository,
  MongoDBRepertoireRepository,
  MongoDBSongRepository,
  MongoDBUserRepository,
} from './mongodb/repositories';
import {
  EventMomentSchema,
  EventSchema,
  RepertoireSchema,
  RepertoireSongSchema,
  SongSchema,
  UserSchema,
} from './mongodb/schemas';

const MONGO_DB_CLIENT = 'MONGO_DB_CLIENT';

const makeModels = () => {
  const map = {
    [MongoModelsName.Events]: EventSchema,
    [MongoModelsName.EventMoments]: EventMomentSchema,
    [MongoModelsName.Users]: UserSchema,
    [MongoModelsName.Songs]: SongSchema,
    [MongoModelsName.Repertoires]: RepertoireSchema,
    [MongoModelsName.RepertoireSongs]: RepertoireSongSchema,
  };

  return Object.keys(map).map((key) => {
    return {
      provide: key,
      useFactory: (connection: Connection) => {
        return connection.model(key, map[key]);
      },
      inject: [MONGO_DB_CLIENT],
    };
  });
};

@Global()
@Module({
  providers: [
    {
      provide: MONGO_DB_CLIENT,
      useFactory: async () => {
        const mongoose = await connect(
          'mongodb+srv://flavionobredev:xWQU54OB2gWxOXB6@musicash-prd.xlpj4.mongodb.net/musicash-db?retryWrites=true&w=majority&appName=musicash-prd',
        );
        Logger.verbose('MongoDB connected', MONGO_DB_CLIENT);
        return mongoose;
      },
    },
    ...makeModels(),
    {
      provide: EventRepository,
      useClass: MongoDBEventRepository,
    },
    {
      provide: UserRepository,
      useClass: MongoDBUserRepository,
    },
    {
      provide: RepertoireRepository,
      useClass: MongoDBRepertoireRepository,
    },
    {
      provide: SongRepository,
      useClass: MongoDBSongRepository,
    },
  ],
  exports: [
    EventRepository,
    RepertoireRepository,
    SongRepository,
    UserRepository,
  ],
})
export class DatabaseModule {}
