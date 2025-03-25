import { Module } from '@nestjs/common';
import { CreateDefaultEventUsecase } from 'src/@core/application/usecase';
import { EventRepository } from 'src/@core/domain/event/repository/event.repository';
import { RepertoireRepository } from 'src/@core/domain/repertoire/repository/repertoire.repository';
import { UserRepository } from 'src/@core/domain/user';
import { EventsController } from './controllers';

@Module({
  controllers: [EventsController],
  providers: [
    {
      provide: CreateDefaultEventUsecase,
      useFactory: (repertoire, event, user) => {
        return new CreateDefaultEventUsecase(repertoire, event, user);
      },
      inject: [
        RepertoireRepository,
        EventRepository,
        UserRepository,
      ],
    },
  ],
})
export class EventsModule {}
