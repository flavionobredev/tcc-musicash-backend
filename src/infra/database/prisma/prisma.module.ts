import { Module, Provider } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DbPrismaClient } from './client';

const prismaProvider: Provider = {
  provide: DbPrismaClient,
  useFactory: () => {
    return new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
  },
};

@Module({
  providers: [prismaProvider],
  exports: [prismaProvider],
})
export class PrismaModule {}
