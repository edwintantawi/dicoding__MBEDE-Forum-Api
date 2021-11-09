const Hapi = require('@hapi/hapi');
const { getEnv } = require('../../../config/env');
const { usersPlugin } = require('../../Interfaces/http/api/users');
const { container } = require('../container');

const createServer = async () => {
  const server = Hapi.server({
    host: getEnv('HOST'),
    port: getEnv('PORT'),
  });

  server.register([{ plugin: usersPlugin, options: { container } }]);

  return server;
};

module.exports = { createServer };
