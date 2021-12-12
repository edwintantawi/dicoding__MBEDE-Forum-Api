const { LikesHandler } = require('./handler');
const { likesRoutes } = require('./routes');

const likesPlugin = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { container }) => {
    const likesHandler = new LikesHandler(container);
    const routes = likesRoutes(likesHandler);
    server.route(routes);
  },
};

module.exports = { likesPlugin };
