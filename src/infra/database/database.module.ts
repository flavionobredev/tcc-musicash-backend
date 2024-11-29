import { Module } from '@nestjs/common';
import { PrismaEventRepository } from 'src/@core/infra/event/repository/prisma.repository';
import { PrismaRepertoireRepository } from 'src/@core/infra/repertoire/repository/prisma.repository';
import { PrismaSongRepository } from 'src/@core/infra/song/repository/prisma.repository';
import { PrismaUserRepository } from 'src/@core/infra/user/repository/prisma.repository';
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
    provide: PrismaUserRepository,
    useFactory: (prisma: DbPrismaClient) => {
      return new PrismaUserRepository(prisma);
    },
    inject: [DbPrismaClient],
  },
];

@Module({
  imports: [PrismaModule],
  providers: providers,
  exports: providers,
})
export class DatabaseModule {}
