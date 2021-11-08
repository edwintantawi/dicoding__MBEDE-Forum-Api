// istanbul ignore file
const { Pool } = require('pg');
const { getEnv } = require('../../../../config/env');

const testConfig = {
  host: getEnv('PGHOST_TEST'),
  port: getEnv('PGPORT_TEST'),
  user: getEnv('PGUSER_TEST'),
  password: getEnv('PGPASSWORD_TEST'),
  database: getEnv('PGDATABASE_TEST'),
};

const pool = getEnv('NODE_ENV') === 'test' ? new Pool(testConfig) : new Pool();

module.exports = { pool };
