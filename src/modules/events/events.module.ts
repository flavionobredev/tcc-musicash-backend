import { Module } from '@nestjs/common';
import { CreateDefaultEventUsecase } from 'src/@core/application/usecase';
import { UserRepository } from 'src/@core/domain/user';
import {
  PrismaEventRepository,
  PrismaRepertoireRepository,
} from 'src/@core/infra/repositories';
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
        PrismaRepertoireRepository,
        PrismaEventRepository,
        UserRepository,
      ],
    },
  ],
})
export class EventsModule {}
