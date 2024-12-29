import { PrismaClient } from '@prisma/client';
import { spawn } from 'node:child_process';
import { chmod, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { E2E_TESTING_DB, makeDbFilePath } from 'test/jest.setup';

let client: PrismaClient;

function pushSchemaToPrismaDB(dbPath: string) {
  return new Promise((resolve, reject) => {
    const schemaPath = join(process.cwd(), 'prisma', 'schemas');
    const result = spawn(
      `export DATABASE_URL=${dbPath} && npx prisma db push --accept-data-loss --schema=${schemaPath}`,
      {
        shell: true,
      },
    );
    const stderror = [];

    result.stderr.on('data', (data) => {
      stderror.push(data);
    });

    result.on('error', (err) => {
      reject(err);
    });

    result.on('exit', (code) => {
      if (code !== 0) return reject(`errors: ${stderror.join('')}`);
      return resolve(void 0);
    });
  });
}

async function deleteOldDB(filePath: string) {
  await rm(filePath, { force: true }).catch((err) => {
    console.log('error ao remover', err);
  });
}

export async function makeTestPrismaClient() {
  await removeTestPrismaClient();
  await pushSchemaToPrismaDB(`file:${makeDbFilePath(E2E_TESTING_DB)}`);
  await chmod(makeDbFilePath(E2E_TESTING_DB), '666');
  const prisma = new PrismaClient({
    datasourceUrl: `file:${makeDbFilePath(E2E_TESTING_DB)}`,
  });

  client = prisma;
  return prisma;
}

export async function removeTestPrismaClient() {
  if (client) await client.$disconnect();
  await deleteOldDB(makeDbFilePath(E2E_TESTING_DB));
}
