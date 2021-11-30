const commentsRoutes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'threadsapp_jwt',
    },
  },
];

module.exports = { commentsRoutes };
