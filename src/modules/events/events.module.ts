import { Module } from '@nestjs/common';
import { CreateDefaultEventUsecase } from 'src/@core/application/usecase';
import {
  PrismaEventRepository,
  PrismaRepertoireRepository,
} from 'src/@core/infra/repositories';
import { PrismaUserRepository } from 'src/@core/infra/repositories/prisma-user.repository';
import { DatabaseModule } from 'src/infra/database/database.module';
import { EventsController } from './controllers';

@Module({
  imports: [DatabaseModule],
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
        PrismaUserRepository,
      ],
    },
  ],
})
export class EventsModule {}
