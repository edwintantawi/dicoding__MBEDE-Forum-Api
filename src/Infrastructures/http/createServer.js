const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const { getEnv } = require('../../Commons/helpers/getEnv');
const { usersPlugin } = require('../../Interfaces/http/api/users');
const {
  authenticationsPlugin,
} = require('../../Interfaces/http/api/authentications');

const { extensionsPlugin } = require('../../Interfaces/http/extensions');
const { threadsPlugin } = require('../../Interfaces/http/api/threads');
const { commentsPlugin } = require('../../Interfaces/http/api/comments');
const { repliesPlugin } = require('../../Interfaces/http/api/replies');
const { likesPlugin } = require('../../Interfaces/http/api/likes');

const createServer = async ({ container }) => {
  const server = Hapi.server({
    host: getEnv('HOST'),
    port: getEnv('PORT'),
  });

  await server.register([{ plugin: Jwt }]);

  server.auth.strategy('threadsapp_jwt', 'jwt', {
    keys: getEnv('ACCESS_TOKEN_KEY'),
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: getEnv('ACCESS_TOKEN_AGE'),
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    { plugin: usersPlugin, options: { container } },
    {
      plugin: authenticationsPlugin,
      options: { container },
    },
    {
      plugin: threadsPlugin,
      options: { container },
    },
    {
      plugin: commentsPlugin,
      options: { container },
    },
    {
      plugin: repliesPlugin,
      options: { container },
    },
    {
      plugin: likesPlugin,
      options: { container },
    },
  ]);

  await server.register([{ plugin: extensionsPlugin }]);

  return server;
};

module.exports = { createServer };
