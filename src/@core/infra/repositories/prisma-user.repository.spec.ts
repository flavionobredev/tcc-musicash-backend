import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import {
  makeTestPrismaClient,
  removeTestPrismaClient,
} from 'test/@shared/utils/prisma/db-connection.util';
import { PrismaUserRepository } from './prisma-user.repository';

describe('PrismaSongRepository', () => {
  let prisma: PrismaClient;

  let repository: PrismaUserRepository;

  beforeAll(async () => {
    prisma = await makeTestPrismaClient('testing-user.db');
    repository = new PrismaUserRepository(prisma);
  });

  afterAll(async () => {
    await removeTestPrismaClient('testing-user.db');
  });

  it('should find a user by id', async () => {
    const id = randomUUID();
    await prisma.users.create({
      data: {
        id: id,
      },
    });

    const result = await repository.findById(id);

    expect(result).toEqual({
      id: id,
      createdAt: expect.any(Date),
      updatedAt: undefined,
    });
  });

  it('should return null when user is not found', async () => {
    const result = await repository.findById(randomUUID());

    expect(result).toBeNull();
  });
});
