import { PrismaClient } from '@prisma/client';
import { User } from 'src/@core/domain/user/entity/user.entity';
import { UserRepository } from 'src/@core/domain/user/repository/user.repository';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(entity: User): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<User> {
    const result = await this.prisma.users.findUnique({ where: { id } });
    if (!result) return null;
    return new User({
      id: result.id,
      email: result.email,
      name: result.name,
    });
  }

  async findByEmail(email: string) {
    const result = await this.prisma.users.findUnique({ where: { email } });
    if (!result) return null;
    return new User({
      id: result.id,
      email: result.email,
      name: result.name,
    });
  }

  async upsertByEmail(entity: User): Promise<void> {
    await this.prisma.users.upsert({
      where: { email: entity.email },
      update: {
        name: entity.name,
        picture: entity.picture,
      },
      create: {
        id: entity.id,
        email: entity.email,
        name: entity.name,
        picture: entity.picture,
      },
    });
  }
}
