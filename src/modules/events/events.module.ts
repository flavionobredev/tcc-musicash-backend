import { Module } from '@nestjs/common';
import { CreateDefaultEventUsecase } from 'src/@core/application/usecase';
import { PrismaEventRepository } from 'src/@core/infra/event/repository/prisma.repository';
import { PrismaRepertoireRepository } from 'src/@core/infra/repertoire/repository/prisma.repository';
import { PrismaUserRepository } from 'src/@core/infra/user/repository/prisma.repository';
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
