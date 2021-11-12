const { UsersHandler } = require('./handler');
const { usersRoutes } = require('./routes');

const usersPlugin = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container);
    const routes = usersRoutes(usersHandler);
    server.route(routes);
  },
};

module.exports = { usersPlugin };
