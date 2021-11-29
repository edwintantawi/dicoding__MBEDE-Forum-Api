const threadsRoutes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'threadsapp_jwt',
    },
  },
];

module.exports = { threadsRoutes };
