import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { User } from 'src/@core/domain/user';
import {
  makeTestPrismaClient,
  removeTestPrismaClient,
} from 'test/@shared/utils/prisma/db-connection.util';
import { PrismaUserRepository } from './prisma-user.repository';

describe('PrismaSongRepository', () => {
  let prisma: PrismaClient;

  let repository: PrismaUserRepository;

  beforeAll(async () => {
    prisma = await makeTestPrismaClient();
    repository = new PrismaUserRepository(prisma);
  });

  afterAll(async () => {
    await removeTestPrismaClient();
  });

  it('should find a user by id', async () => {
    const user = {
      id: randomUUID(),
      email: 'teste@teste.com',
      name: 'Teste',
    };
    await prisma.users.create({
      data: user,
    });

    const result = await repository.findById(user.id);

    expect(result.toJSON()).toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: expect.any(Date),
      updatedAt: undefined,
    });
  });

  it('should find a user by email', async () => {
    const user = {
      id: randomUUID(),
      email: 'testeemail@teste.com',
      name: 'Teste',
    };
    await prisma.users.create({
      data: user,
    });

    const result = await repository.findByEmail(user.email);

    expect(result.toJSON()).toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: expect.any(Date),
      updatedAt: undefined,
    });
  });

  it('should return null when user is not found', async () => {
    const result = await repository.findById(randomUUID());

    expect(result).toBeNull();
  });

  it('should upsert a user by email', async () => {
    const user = new User({
      email: 'teste@teste.com',
      name: 'Teste',
    });

    await repository.upsertByEmail(user);

    const result = await prisma.users.findUnique({
      where: { email: user.email },
    });

    expect(result).toEqual({
      id: expect.any(String),
      email: user.email,
      name: user.name,
      picture: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    user.name = 'Teste 2';

    await repository.upsertByEmail(user);

    const result2 = await prisma.users.findUnique({
      where: { email: user.email },
    });

    expect(result2).toEqual({
      id: expect.any(String),
      email: user.email,
      name: user.name,
      picture: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
