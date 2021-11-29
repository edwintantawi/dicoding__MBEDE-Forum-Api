const { ThreadsHandler } = require('./handler');
const { threadsRoutes } = require('./routes');

const threadsPlugin = {
  name: 'threads',
  version: '1.0.0',
  register: async (server, { container }) => {
    const threadsHandler = new ThreadsHandler(container);
    const routes = threadsRoutes(threadsHandler);
    server.route(routes);
  },
};

module.exports = { threadsPlugin };
