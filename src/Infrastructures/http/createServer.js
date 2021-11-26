const Hapi = require('@hapi/hapi');
const { getEnv } = require('../../Commons/helpers/getEnv');
const { usersPlugin } = require('../../Interfaces/http/api/users');
const {
  authenticationsPlugin,
} = require('../../Interfaces/http/api/authentications');

const { extensionsPlugin } = require('../../Interfaces/http/extensions');

const createServer = async ({ container }) => {
  const server = Hapi.server({
    host: getEnv('HOST'),
    port: getEnv('PORT'),
  });

  server.register([
    { plugin: usersPlugin, options: { container } },
    {
      plugin: authenticationsPlugin,
      options: { container },
    },
  ]);

  server.register([{ plugin: extensionsPlugin }]);

  return server;
};

module.exports = { createServer };
