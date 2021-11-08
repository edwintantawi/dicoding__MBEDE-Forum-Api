// istanbul ignore file
require('dotenv').config();

const getEnv = (name) => {
  const env = process.env[name];
  if (env === undefined) throw new Error(`[.env] process.env.${name} not found`);
  return env;
};

module.exports = { getEnv };
