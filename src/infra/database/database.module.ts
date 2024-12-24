import { Global, Module } from '@nestjs/common';
import { UserRepository } from 'src/@core/domain/user';
import {
  PrismaEventRepository,
  PrismaRepertoireRepository,
} from 'src/@core/infra/repositories';
import { PrismaSongRepository } from 'src/@core/infra/repositories/prisma-song.repository';
import { PrismaUserRepository } from 'src/@core/infra/repositories/prisma-user.repository';
import { DbPrismaClient, PrismaModule } from './prisma';

const providers = [
  {
    provide: PrismaEventRepository,
    useFactory: (prisma: DbPrismaClient) => {
      return new PrismaEventRepository(prisma);
    },
    inject: [DbPrismaClient],
  },
  {
    provide: PrismaRepertoireRepository,
    useFactory: (prisma: DbPrismaClient) => {
      return new PrismaRepertoireRepository(prisma);
    },
    inject: [DbPrismaClient],
  },
  {
    provide: PrismaSongRepository,
    useFactory: (prisma: DbPrismaClient) => {
      return new PrismaSongRepository(prisma);
    },
    inject: [DbPrismaClient],
  },
  {
    provide: UserRepository,
    useFactory: (prisma: DbPrismaClient) => {
      return new PrismaUserRepository(prisma);
    },
    inject: [DbPrismaClient],
  },
];

@Global()
@Module({
  imports: [PrismaModule],
  providers: providers,
  exports: [
    PrismaEventRepository,
    PrismaRepertoireRepository,
    PrismaSongRepository,
    UserRepository,
  ],
})
export class DatabaseModule {}
