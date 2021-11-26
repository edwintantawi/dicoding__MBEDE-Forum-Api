const { authenticationsRoutes } = require('./routes');
const { AuthenticationsHandler } = require('./handler');

const authenticationsPlugin = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container);
    const routes = authenticationsRoutes(authenticationsHandler);
    server.route(routes);
  },
};

module.exports = { authenticationsPlugin };
