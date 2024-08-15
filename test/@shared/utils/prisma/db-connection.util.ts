import { PrismaClient } from '@prisma/client';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { rm } from 'node:fs/promises';

let client: PrismaClient;

const makeDbFilePath = (filename: string) =>
  join(process.cwd(), 'prisma', filename);

function pushSchemaToPrismaDB(dbPath: string) {
  return new Promise((resolve, reject) => {
    const schemaPath = join(process.cwd(), 'prisma', 'schemas');
    const result = spawn(
      `export DATABASE_URL=${dbPath} && npx`,
      ['prisma', 'db', 'push', '--accept-data-loss', `--schema=${schemaPath}`],
      {
        shell: true,
      },
    );

    result.on('error', (err) => {
      reject(err);
    });
    result.on('exit', (code) => {
      if (code === 0) {
        resolve(void 0);
      }
    });
  });
}

async function deleteOldDB(filePath: string) {
  await rm(filePath, { force: true }).catch((err) => {
    console.log('error ao remover', err);
  });
}

export async function makeTestPrismaClient(filename: string) {
  if (client) return client;
  await deleteOldDB(makeDbFilePath(filename));
  await pushSchemaToPrismaDB(`file:${makeDbFilePath(filename)}`);
  const prisma = new PrismaClient({
    datasourceUrl: `file:${makeDbFilePath(filename)}`,
  });

  client = prisma;
  return prisma;
}
