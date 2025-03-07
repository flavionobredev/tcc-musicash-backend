import { Module } from '@nestjs/common';
import { CreateDefaultEventUsecase } from 'src/@core/application/usecase';
import { EventsController } from './controllers';

@Module({
  controllers: [EventsController],
  providers: [
    {
      provide: CreateDefaultEventUsecase,
      useFactory: (repertoire, event, user) => {
        return new CreateDefaultEventUsecase(repertoire, event, user);
      },
    },
  ],
})
export class EventsModule {}
