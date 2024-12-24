const { join } = require('node:path');
const E2E_TESTING_DB = 'e2e_testing.db';

const makeDbFilePath = (filename) => join(process.cwd(), 'prisma', filename);

process.env.DATABASE_URL = `file:${makeDbFilePath(E2E_TESTING_DB)}`;

module.exports = {
  E2E_TESTING_DB,
  makeDbFilePath
};
