const { RepliesHandler } = require('./handler');
const { repliesRoutes } = require('./routes');

const repliesPlugin = {
  name: 'replies',
  version: '1.0.0',
  register: async (server, { container }) => {
    const repliesHandler = new RepliesHandler(container);
    const routes = repliesRoutes(repliesHandler);
    server.route(routes);
  },
};

module.exports = { repliesPlugin };
