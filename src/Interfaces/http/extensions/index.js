const { events } = require('./events');
const { ExtensionsHandler } = require('./handler');

const extensionsPlugin = {
  name: 'errors',
  version: '1.0.0',
  register: (server) => {
    const extensionsHandler = new ExtensionsHandler();
    const extensionEvents = events(extensionsHandler);
    server.ext(extensionEvents);
  },
};

module.exports = { extensionsPlugin };
