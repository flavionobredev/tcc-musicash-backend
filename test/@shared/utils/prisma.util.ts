import { PrismaClient } from '@prisma/client';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

let client: PrismaClient;

function pushSchemaToPrismaDB(dbPath: string) {
  return new Promise((resolve, reject) => {
    const schemaPath = join(process.cwd(), 'prisma', 'schemas');
    const result = spawn(
      `export DATABASE_URL=${dbPath} && npx`,
      ['prisma', 'db', 'push', '--accept-data-loss', `--schema=${schemaPath}`],
      {
        stdio: 'inherit',
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

export async function makeTestPrismaClient(dbPath: string) {
  if (client) return client;
  await pushSchemaToPrismaDB(dbPath);
  const prisma = new PrismaClient({
    datasourceUrl: dbPath,
  });

  client = prisma;
  return prisma;
}
