require('dotenv').config();
const { container } = require('./Infrastructures/container');
const { createServer } = require('./Infrastructures/http/createServer');

(async () => {
  const server = await createServer({ container });
  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
